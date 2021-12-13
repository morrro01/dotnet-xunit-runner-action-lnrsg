import * as exec from '@actions/exec';
import * as xunit from '../src/xunit';
import * as inputs from '../src/inputs';
import { XUNIT_RESULTS_FILENAME } from '../src/constants';
import * as _fixtures from './_fixtures';

describe( 'test', () => {

    it( 'calls exec', async () => {
        const spy: jest.SpyInstance = jest.spyOn( exec, 'exec' );
        spy.mockImplementation(() => Promise.resolve( expect.any( Number )));

        const inputArgs = [
            { name: 'path', value: '.' },
            { name: 'comment_on_pr', value: 'false' },
            { name: 'upload_artifact', value: 'false' },
            { name: 'fail_on_nonpassing', value: 'false' }
        ];

        // Reset all environment variables.
        _fixtures.resetActionInputs();

        // Prepare the inputs.
        inputArgs.forEach( input =>
            _fixtures.setActionInput( input.name, input.value ));

        // Read/parse the inputs.
        const parsed = inputs.getInputs();

        // Call it.
        await xunit.test( parsed );
        const cmd = `dotnet test --logger "trx;LogFileName=${XUNIT_RESULTS_FILENAME}`;
        expect( spy ).toHaveBeenCalledWith( cmd );
    })
});