export function handleTypo(a: string, b: string): number {
    const m = a.length, n = b.length
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))

    for (let i = 0; i <= m; i++) dp[i][0] = i
    for (let j = 0; j <= n; j++) dp[0][j] = j

    for (let i = 1; i <= m; i++){
        for (let j = 1; j <= n; j++){
            const cost = a[i -1] === b[j - 1] ? 0 : 1

            dp[i][j] = Math.min(
                dp[i - 1][j] + 1,
                dp[i][j - 1] + 1,
                dp[i - 1][j - 1] + cost,
            )
        }
    }

    return dp[m][n]
}

export function similarity(a: string, b: string): number {
    a = a.toLowerCase().normalize('NFKC').trim()
    b = b.toLowerCase().normalize('NFKC').trim()
    
    const distance = handleTypo(a, b)
    const maxLen = Math.max(a.length, b.length)
    
    return maxLen === 0 ? 1 : 1 - distance / maxLen
}