import * as result from '../src/result';
import * as _fixtures from './_fixtures';

describe( 'getResults', () => {

    it( 'parses trx file as xml into json', async () => {
        const parsedResult = await result.getResults( _fixtures.MockGeneratedResultPath );
        expect( parsedResult ).toBeDefined();
        expect( parsedResult!.total ).toEqual( 7 );
    })
});