const QUERY = `
  query userStats($username: String!) {
    matchedUser(username: $username) {
      username
      profile { ranking }
      submitStatsGlobal {
        acSubmissionNum { difficulty count }
      }
    }
    allQuestionsCount { difficulty count }
  }
`;

type GqlResp = {
  data?: {
    matchedUser: {
      username: string;
      profile: { ranking: number };
      submitStatsGlobal: {
        acSubmissionNum: { difficulty: "All" | "Easy" | "Medium" | "Hard"; count: number }[];
      };
    } | null;
    allQuestionsCount: { difficulty: "All" | "Easy" | "Medium" | "Hard"; count: number }[];
  };
  errors?: { message: string }[];
};

function bucket(arr: { difficulty: string; count: number }[], key: string): number {
  return arr.find((b) => b.difficulty === key)?.count ?? 0;
}

export async function onRequest(context: { request: Request }): Promise<Response> {
  const url = new URL(context.request.url);
  const username = String(url.searchParams.get("username") || "").trim();
  if (!username) {
    return new Response(JSON.stringify({ error: "missing_username" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  try {
    const upstream = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Ramraj-portfolio-proxy",
        "Referer": `https://leetcode.com/u/${username}`,
      },
      body: JSON.stringify({ query: QUERY, variables: { username } }),
    });

    if (!upstream.ok) {
      return new Response(JSON.stringify({ error: "upstream_error", status: upstream.status }), {
        status: upstream.status,
        headers: { "content-type": "application/json" },
      });
    }

    const json = (await upstream.json()) as GqlResp;
    if (json.errors?.length || !json.data?.matchedUser) {
      return new Response(JSON.stringify({ error: "user_not_found" }), {
        status: 404,
        headers: { "content-type": "application/json" },
      });
    }

    const u = json.data.matchedUser;
    const solved = u.submitStatsGlobal.acSubmissionNum;
    const all = json.data.allQuestionsCount;

    return new Response(
      JSON.stringify({
        username: u.username,
        ranking: u.profile.ranking,
        totalSolved: bucket(solved, "All"),
        easySolved: bucket(solved, "Easy"),
        mediumSolved: bucket(solved, "Medium"),
        hardSolved: bucket(solved, "Hard"),
        totalQuestions: bucket(all, "All"),
        totalEasy: bucket(all, "Easy"),
        totalMedium: bucket(all, "Medium"),
        totalHard: bucket(all, "Hard"),
      }),
      {
        status: 200,
        headers: {
          "content-type": "application/json",
          "cache-control": "public, s-maxage=300, stale-while-revalidate=600",
          "access-control-allow-origin": "*",
        },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: "proxy_failed", detail: String(err?.message || err) }),
      { status: 502, headers: { "content-type": "application/json" } }
    );
  }
}
