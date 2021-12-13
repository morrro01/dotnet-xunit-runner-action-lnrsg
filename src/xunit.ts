import * as core from '@actions/core';
import * as exec from '@actions/exec';
import { promises as fsp } from 'fs';
import { IActionInputs } from './types';
import * as inputs from './inputs';
import { XUNIT_RESULTS_FILENAME } from './constants';

/**
 * Runs XUnit using the provided action inputs.
 * 
 * @param {IActionInputs} inputs
 */
export async function test( params: IActionInputs ): Promise<void> {
    core.startGroup( '🔬 XUnit Tests' );

    try {
        const args = inputs.getXUnitArgsString( params );
        const cmd = `dotnet test ${args}`;

        core.info( `Command: '${cmd}'` );
        await exec.exec( cmd );

        const generated = await didResultsGenerate( params );
        if ( !generated )
            throw new Error( `XUnit execution failed; no files found in "${inputs.getXUnitOutputDirPath( params )}".` );

        core.info( 'XUnit execution successful.' );
    } catch ( err: any ) {
        console.warn( err.message );
    }

    core.endGroup();
}

/**
 * Whether the XUnit test execution successfully completed, as determined by
 * checking for the presence of a generated results file.
 * 
 * @param {IActionInputs} params 
 * @returns {Promise<boolean>}
 */
export async function didResultsGenerate( params: IActionInputs ): Promise<boolean> {
    let generated = false;

    try {
        const outputDirPath = inputs.getXUnitOutputDirPath( params );
        const generatedFiles = await fsp.readdir( outputDirPath );

        generated = generatedFiles.some( generatedFile =>
            generatedFile.indexOf( XUNIT_RESULTS_FILENAME ) !== -1 );
    } catch { }

    return generated;
}