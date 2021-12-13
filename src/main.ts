import * as core from '@actions/core';
import { IActionInputs } from './types';
import * as xunit from './xunit';
import * as upload from './upload';
import * as result from './result';
import * as inputs from './inputs';
import * as comment from './comment';

/**
 * Primary entry point of the action.
 */
export async function run(): Promise<void> {
    const params = inputs.getInputs();

    // 1. Run XUnit.
    await xunit.test( params );

    // 2. Parse the results.
    const results = await result.getResults(
        inputs.getXUnitOutputReportPath( params ));

    // 3. Generate a PR comment.
    await comment.generate( params, results );

    // 4. Upload a results artifact.
    await upload.generate( params );

    // 5. Check for non-passing failure.
    failureCheck( params, results );
}

/**
 * Final step of the action. If "fail_on_nonpassing" is enabled, uses the parsed
 * results to determine whether the number of passing tests is equal to the total
 * number of tests. If not equal, fails the action.
 * 
 * @param {IActionInputs} params
 * @param {result.IResult | undefined} results 
 */
function failureCheck( params: IActionInputs, results: result.IResult | undefined ) {

    if ( params.fail_on_nonpassing ) {

        // Expect results.
        if ( !results ) {
            core.setFailed( 'The action completed, but is failed because "fail_on_nonpassing" is enabled and no test results could be found.' );
            return;
        }

        // Expect the number of passes to equal the number of tests.
        if ( results.passed !== results.total )
            core.setFailed( `The action completed, but is failed because "fail_on_nonpassing" is enabled and ${results.total - results.passed} tests did not report as "PASSED".` );
    }
}

// RUNNIT!
run();