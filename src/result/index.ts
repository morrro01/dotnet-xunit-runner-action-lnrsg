import { promises as fsp } from 'fs';
import { parseStringPromise as parseXmlString } from 'xml2js';
import { IResult } from './types';
export * from './types';

/**
 * Fetches a JSON-based result summary a parsed XUnit XML file found at the
 * provided file path.
 * 
 * @param {string} filePath 
 * @returns {Promise<IReport | undefined>}
 */
export async function getResults( filePath: string ): Promise<IResult | undefined> {
    let results: IResult | undefined;

    try {
        const content = await fsp.readFile( filePath, 'utf8' );
        const json = await parseXmlString( content );
        const resultSummaryArr = json?.TestRun?.ResultSummary;

        if ( !resultSummaryArr ||
            !Array.isArray( resultSummaryArr ) ||
            resultSummaryArr.length !== 1 )
            throw new Error( 'Invalid result file; expected ResultSummary.' );

        const resultSummary = resultSummaryArr[ 0 ];
        if ( !resultSummary ||
            !Array.isArray( resultSummary.Counters ) ||
            resultSummary.Counters.length !== 1 )
            throw new Error( 'Invalid result file; expected ResultSummary.Counters.' );

        const countersObj = resultSummary.Counters[ 0 ];
        if ( !countersObj || !countersObj.$ )
            throw new Error( 'Invalid result file; expected ResultSummary.Counters.' );

        const counters = countersObj.$;
        results = {
            total: parseInt( counters.total || '0' ),
            executed: parseInt( counters.executed || '0' ),
            passed: parseInt( counters.passed || '0' ),
            inconclusive: parseInt( counters.inconclusive || '0' ),
            failed: parseInt( counters.failed || '0' ),
            error: parseInt( counters.error || '0' ),
            warning: parseInt( counters.warning || '0' )
        };
    } catch ( err: any ) {
        console.warn( err.message );
    }

    return results;
}

