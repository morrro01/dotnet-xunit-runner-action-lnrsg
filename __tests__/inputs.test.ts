import * as inputs from '../src/inputs';
import * as _fixtures from './_fixtures';

describe( 'getInputs', () => {

    //
    // Valid Tests
    //
    _fixtures.ValidInputsTests.forEach( inputTest => {

        it( inputTest.title, () => {

            // Reset all environment variables.
            _fixtures.resetActionInputs();

            // Prepare the inputs.
            inputTest.inputs.forEach( input =>
                _fixtures.setActionInput( input.name, input.value ));

            // Read/parse the inputs.
            const parsed = inputs.getInputs();
            expect( parsed ).toEqual( inputTest.output );
        })
    });

    //
    // Invalid Tests
    //
    _fixtures.InvalidInputsTests.forEach( inputTest => {

        it( inputTest.title, () => {

            // Reset all environment variables.
            _fixtures.resetActionInputs();

            // Prepare the inputs.
            inputTest.inputs.forEach( input =>
                _fixtures.setActionInput( input.name, input.value ));

            // Validate that it throws.
            expect( () => inputs.getInputs() ).toThrow( new Error( inputTest.output as string ));
        });
    });
});

describe( 'getXUnitArgs', () => {

    _fixtures.ValidXUnitArgsTests
        .filter( argsTest => Array.isArray( argsTest.output ))
        .forEach( argsTest => {

            it( argsTest.title, () => {

                // Reset all environment variables.
                _fixtures.resetActionInputs();

                // Prepare the inputs.
                argsTest.inputs.forEach( input =>
                    _fixtures.setActionInput( input.name, input.value ));

                // Read/parse the inputs.
                const parsed = inputs.getInputs();

                // Fetch/parse scanner args.
                const args = inputs.getXUnitArgs( parsed );
                expect( args ).toEqual( argsTest.output );
            });
        });
});

describe( 'getXUnitArgsString', () => {

    _fixtures.ValidXUnitArgsTests
        .filter( argsTest => typeof argsTest.output === 'string' )
        .forEach( argsTest => {

            it( argsTest.title, () => {

                // Reset all environment variables.
                _fixtures.resetActionInputs();

                // Prepare the inputs.
                argsTest.inputs.forEach( input =>
                    _fixtures.setActionInput( input.name, input.value ));

                // Read/parse the inputs.
                const parsed = inputs.getInputs();

                // Fetch/parse scanner args.
                const args = inputs.getXUnitArgsString( parsed );
                expect( args ).toEqual( argsTest.output );
            });
        });
});

describe( 'getXUnitOutputDirPath', () => {
    _fixtures.ValidDirPathTests
        .forEach( pathTest => {
            it( pathTest.title, () => {

                // Reset all environment variables.
                _fixtures.resetActionInputs();

                // Prepare the inputs.
                pathTest.inputs.forEach( input =>
                    _fixtures.setActionInput( input.name, input.value ));

                // Read/parse the inputs.
                const parsed = inputs.getInputs();

                // Fetch/parse scanner args.
                const args = inputs.getXUnitOutputDirPath( parsed );
                expect( args ).toEqual( pathTest.output );
            });
        });
});

describe( 'getXUnitOutputReportPath', () => {
    _fixtures.ValidReportPathTests
        .forEach( pathTest => {

            // Reset all environment variables.
            _fixtures.resetActionInputs();

            // Prepare the inputs.
            pathTest.inputs.forEach( input =>
                _fixtures.setActionInput( input.name, input.value ));

            // Read/parse the inputs.
            const parsed = inputs.getInputs();

            // Fetch/parse scanner args.
            const args = inputs.getXUnitOutputReportPath( parsed );
            expect( args ).toEqual( pathTest.output );
        });
});