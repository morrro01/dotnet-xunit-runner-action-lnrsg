const fsp = require( 'fs/promises' );
const xml2js = require( 'xml2js' );
const resultsPath = 'C:\\Users\\morrro01\\Development\\git\\ins-arportal-core\\ARCore.Tests\\TestResults\\TestResults.xml';

const parseXml = async ( xmlString ) => {
    const result = await xml2js.parseStringPromise( xmlString );
    return result;
};

const getContent = async ( filePath ) => {
    const result = await fsp.readFile( filePath, 'utf8' );
    return result;
}

async function run() {
    const xmlString = await getContent( resultsPath );
    console.log( 'xmlString', xmlString );

    const jsonObj = await parseXml( xmlString );
    console.log( 'jsonObj', jsonObj.TestRun.ResultSummary[ 0 ].Counters[ 0 ].$ );
}

run();