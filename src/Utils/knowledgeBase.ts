import * as fs from 'fs'
import path from 'path'

interface KnowledgeEntry {
    keywords: string[]
    execute: Function
}

const knowledgeMap = new Map<string, KnowledgeEntry>()
const keywordIndex = new Map<string, KnowledgeEntry>()
const knowledgeBasePath = path.join(__dirname, '../Commands')

export function loadKnowledgeBase() {
    const files = fs.readdirSync(knowledgeBasePath)
    for (const file of files) {
        try {
            const modulePath = path.join(knowledgeBasePath, file)
            const kb: KnowledgeEntry = require(modulePath)

            if (!kb.keywords || !kb.execute) continue

            knowledgeMap.set(file, kb)

            for (const key of kb.keywords) {
                const getKey = key.toLocaleLowerCase().normalize('NFKC').trim()
                keywordIndex.set(getKey, kb)
            }

            console.log(`[KnowledgeBase] Loaded: ${file} (${kb.keywords.length} keywords.)`)
        } catch (err) {
            console.log(`[KnowledgeBase] Error loading ${file}:`, err)
        }
    }
}

export { keywordIndex, knowledgeMap }