import * as np from 'path';
import * as core from '@actions/core';
import { IActionInputs } from './types';
import {
    XUNIT_RESULTS_FILENAME,
    XUNIT_RESULTS_OUTPUT_DIR
} from './constants';

/**
 * Returns an object containing the parsed inputs provided to the action.
 *
 * @returns {IActionInputs}
 */
export function getInputs(): IActionInputs {
    const github_token = core.getInput( 'github_token' );

    const path = core.getInput( 'path' );
    if ( path.length === 0 )
        throw new Error( `The "path" input must be provided, and not empty.` );

    const test_args = core.getMultilineInput( 'test_args' );
    const comment_on_pr = core.getBooleanInput( 'comment_on_pr' );
    const comment_title = core.getInput( 'comment_title' );
    const upload_artifact = core.getBooleanInput( 'upload_artifact' );
    const artifact_name = core.getInput( 'artifact_name' );
    const artifact_retention_days = Number( core.getInput( 'artifact_retention_days' ) || 30 );
    const fail_on_nonpassing = core.getBooleanInput( 'fail_on_nonpassing' );

    // Validate commenting params.
    if ( comment_on_pr ) {
        if ( github_token.length === 0 )
            throw new Error( `The "github_token" input must be provided when "comment_on_pr" is true.` );
    }

    // Validate artifact params.
    if ( upload_artifact ) {
        if ( artifact_name.length === 0 )
            throw new Error( `The "artifact_name" input must be provided when "upload_artifact" is true.` );
    }

    return {
        github_token,
        path,
        test_args,
        comment_on_pr,
        comment_title,
        upload_artifact,
        artifact_name,
        artifact_retention_days,
        fail_on_nonpassing
    };
}

/**
 * Returns a collection of arguments passed to XUnit based on the provided
 * action inputs.
 *
 * @param {IActionInputs} inputs
 * @returns {string[]}
 */
export function getXUnitArgs( inputs: IActionInputs ): string[] {
    let args: string[] = [];

    if ( inputs.path !== '.' && inputs.path !== './' )
        args.push( inputs.path );

    if ( inputs.test_args )
        inputs.test_args.forEach( arg => args.push( arg ));

    args.push( `--logger "trx;LogFileName=${XUNIT_RESULTS_FILENAME}` );

    return args;
}

/**
 * Returns space-delimited string of arguments passed to XUnit based on
 * the provided action inputs.
 * 
 * @param {IActionInputs} inputs 
 * @returns {string}
 */
export function getXUnitArgsString( inputs: IActionInputs ): string {
    const args = getXUnitArgs( inputs );
    return args.join( ' ' );
}

/**
 * Returns the full workspace path to the expected output directory to
 * which XUnit will generate test results.
 * 
 * @param {IActionInputs} inputs
 * @returns {string}
 */
export function getXUnitOutputDirPath( inputs: IActionInputs ): string {
    return np.join( inputs.path, XUNIT_RESULTS_OUTPUT_DIR );
}

/**
 * Returns the full workspace path to the expected output report file to
 * which XUnit will generate test results.
 * 
 * @param {IActionInputs} inputs
 * @returns {string}
 */
export function getXUnitOutputReportPath( inputs: IActionInputs ): string {
    return np.join( getXUnitOutputDirPath( inputs ), XUNIT_RESULTS_FILENAME );
}