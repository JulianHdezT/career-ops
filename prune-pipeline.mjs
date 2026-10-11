#!/usr/bin/env node
import { readFile, writeFile } from 'fs/promises';

async function prune() {
  const pipelinePath = 'data/pipeline.md';
  const outputLogPath = '/tmp/claude-1000/-run-media-dev-Datos2-resp0526-repositorios-career-ops/90d88ff7-addd-4877-a7ad-1445190a82d6/tasks/bc09ojo3p.output';

  try {
    const pipelineContent = await readFile(pipelinePath, 'utf-8');
    const logContent = await readFile(outputLogPath, 'utf-8');

    const lines = pipelineContent.split('\n');
    const logLines = logContent.split('\n');

    const expiredUrls = new Set();
    for (const line of logLines) {
      if (line.includes('❌ expired')) {
        const match = line.match(/https?:\/\/[^\s]+/);
        if (match) expiredUrls.add(match[0]);
      }
    }

    console.log(`Found ${expiredUrls.size} expired URLs.`);

    const newLines = lines.map(line => {
      if (line.startsWith('- [ ]')) {
        const match = line.match(/https?:\/\/[^\s|]+/);
        if (match && expiredUrls.has(match[0])) {
          const url = match[0];
          const rest = line.substring(line.indexOf('|') + 1).trim();
          return `- [x] ~~${url} | ${rest}~~ — posting expired (liveness sweep)`;
        }
      }
      return line;
    });

    await writeFile(pipelinePath, newLines.join('\n'));
    console.log('Pipeline pruned successfully.');
  } catch (err) {
    console.error('Error pruning pipeline:', err);
    process.exit(1);
  }
}

prune();
