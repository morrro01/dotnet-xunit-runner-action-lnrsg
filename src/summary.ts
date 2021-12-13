import { IResult } from './result';

/**
 * Generates the markdown for a Pull Request comment based on a parsed XUnit
 * report result.
 * 
 * @param {string} title 
 * @param {IResult} result 
 * @param {string} artifact_name 
 * @returns {string}
 */
export function getSummaryMarkdown( title: string, result: IResult, artifact_name?: string ): string {

    const overallResult = ( result.total === result.passed )
        ? `✔️ Passed`
        : `❌ Failed`;
    const artifactDownload = ( artifact_name )
        ? `*Full test results can be downloaded from the "${artifact_name}" artifact attached in the Summary of this workflow run.*`
        : '';

    let markdown = `### ${title}
    
#### Overview

|||
|---|---|
|**📦 Tests**|${result.total}|
|**🚀 Passing**|${(result.passed * 100 / result.total).toFixed( 0 )}%|
|**🔬 Overall**|${overallResult}|

#### Summary
| Result | Count |
| --- | --- |
| Executed | ${result.executed} |
| Passed | ${result.passed} |
| Inconclusive | ${result.inconclusive} |
| Failed | ${result.failed} |
| Warning | ${result.warning} |
| Error | ${result.error} |

${artifactDownload}
`;

    return markdown;
}