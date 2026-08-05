import type { VercelRequest, VercelResponse } from "@vercel/node";

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const username = String(req.query.username || "").trim();
  if (!username) {
    res.status(400).json({ error: "missing_username" });
    return;
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
      res.status(upstream.status).json({ error: "upstream_error", status: upstream.status });
      return;
    }

    const json = (await upstream.json()) as GqlResp;
    if (json.errors?.length || !json.data?.matchedUser) {
      res.status(404).json({ error: "user_not_found" });
      return;
    }

    const u = json.data.matchedUser;
    const solved = u.submitStatsGlobal.acSubmissionNum;
    const all = json.data.allQuestionsCount;

    res.setHeader("cache-control", "public, s-maxage=300, stale-while-revalidate=600");
    res.status(200).json({
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
    });
  } catch (err) {
    res.status(502).json({ error: "proxy_failed", detail: String(err) });
  }
}
