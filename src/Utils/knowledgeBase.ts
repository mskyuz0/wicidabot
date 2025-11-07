import * as Config from '../../config.json'

export function findBestAnswer(input: string): string | null {
    const knowledgeBase: Record<string, string> = Config.knowledgeBase
    const inputLower = input.toLowerCase().normalize('NFKC')
        .replace(/[^\w\s]/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim()

    for (const key in knowledgeBase) {
        const keyLower = key.toLowerCase().normalize('NFKC').replace(/\s+/g, ' ').trim()
        const regex = new RegExp(`\\b${keyLower}\\b`)
        if (regex.test(inputLower)) {
            return knowledgeBase[key]
        }
    }

    return null
}