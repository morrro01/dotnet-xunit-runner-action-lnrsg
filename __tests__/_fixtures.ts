/* istanbul ignore file */

import * as path from 'path';
import { IActionInputs } from "../src/types";
import {
    XUNIT_RESULTS_FILENAME,
    XUNIT_RESULTS_OUTPUT_DIR
} from '../src/constants';

//
// TYPES
//
interface IActionInputsTestBase {
    title: string;
    inputs: {
        name: string;
        value: string;
    }[];
}

interface IActionInputsTest extends IActionInputsTestBase {
    output: IActionInputs | string;
}

interface IActionInputsXUnitArgsTest extends IActionInputsTestBase {
    output: string[] | string;
}

interface IActionInputsPathTest extends IActionInputsTestBase {
    output: string;
}

//
// HELPER FUNCTIONS
//

/**
 * Helper function returning a GitHub action input in the correct normalized
 * format.
 * 
 * @param {string} name 
 * @returns {string}
 */
export const getActionInputName = ( name: string ): string =>
    `INPUT_${name.replace( / /g, '_' ).toUpperCase()}`;

/**
 * Helper function for setting a GitHub action input as an environment variable.
 * 
 * @param {string} name 
 * @param {string} value 
 */
export const setActionInput = ( name: string, value: string ) =>
    process.env[ getActionInputName( name )] = value;

/**
 * Helper function for resetting a GitHub action input environment variable.
 * 
 * @param {string} name 
 */
export const resetActionInput = ( name: string ) =>
    delete process.env[ getActionInputName( name )];

/**
 * Helper function for resetting all GitHub action input environment variables.
 */
export const resetActionInputs = () => {
    resetActionInput( 'github_token' );
    resetActionInput( 'path' );
    resetActionInput( 'test_args' );
    resetActionInput( 'comment_on_pr' );
    resetActionInput( 'comment_title' );
    resetActionInput( 'upload_artifact' );
    resetActionInput( 'artifact_name' );
    resetActionInput( 'artifact_retention_days' );
    resetActionInput( 'fail_on_nonpassing' );
}

//
// MOCK DATA
//

/**
 * Mock generated XML results.
 */
export const MockGeneratedResultPath = path.join( __dirname, 'xunit-results.trx' );

/**
 * inputs.test.ts
 * 
 * Valid tests.
 */
export const ValidInputsTests: IActionInputsTest[] = [
    {
        title: '"with" minimum valid action inputs',
        inputs: [
            { name: 'path', value: '.' },
            { name: 'comment_on_pr', value: 'false' },
            { name: 'upload_artifact', value: 'false' },
            { name: 'fail_on_nonpassing', value: 'false' }
        ],
        output: {
            github_token: '',
            path: '.',
            test_args: [],
            comment_on_pr: false,
            comment_title: '',
            upload_artifact: false,
            artifact_name: '',
            artifact_retention_days: 30,
            fail_on_nonpassing: false
        }
    },
    {
        title: '"with" valid pr commenting action inputs',
        inputs: [
            { name: 'github_token', value: 'abcd1234' },
            { name: 'path', value: '.' },
            { name: 'comment_on_pr', value: 'true' },
            { name: 'upload_artifact', value: 'false' },
            { name: 'fail_on_nonpassing', value: 'false' }
        ],
        output: {
            github_token: 'abcd1234',
            path: '.',
            test_args: [],
            comment_on_pr: true,
            comment_title: '',
            upload_artifact: false,
            artifact_name: '',
            artifact_retention_days: 30,
            fail_on_nonpassing: false
        }
    },
    {
        title: '"with" valid artifact upload action inputs',
        inputs: [
            { name: 'path', value: '.' },
            { name: 'comment_on_pr', value: 'false' },
            { name: 'upload_artifact', value: 'true' },
            { name: 'artifact_name', value: 'scan-report' },
            { name: 'artifact_retention_days', value: '90' },
            { name: 'fail_on_nonpassing', value: 'false' }
        ],
        output: {
            github_token: '',
            path: '.',
            test_args: [],
            comment_on_pr: false,
            comment_title: '',
            upload_artifact: true,
            artifact_name: 'scan-report',
            artifact_retention_days: 90,
            fail_on_nonpassing: false
        }
    },
    {
        title: '"with" valid kitchen sink action inputs',
        inputs: [
            { name: 'github_token', value: 'abcd1234' },
            { name: 'path', value: '.' },
            { name: 'test_args', value: `-namespace "Mock.SomeNamespace"
-class "Mock.SomeNamespace.SomeClass"` },
            { name: 'comment_on_pr', value: 'true' },
            { name: 'comment_title', value: 'Test Summary' },
            { name: 'upload_artifact', value: 'true' },
            { name: 'artifact_name', value: 'test-report' },
            { name: 'artifact_retention_days', value: '90' },
            { name: 'fail_on_nonpassing', value: 'true' }
        ],
        output: {
            github_token: 'abcd1234',
            path: '.',
            test_args: [
                '-namespace "Mock.SomeNamespace"',
                '-class "Mock.SomeNamespace.SomeClass"'
            ],
            comment_on_pr: true,
            comment_title: 'Test Summary',
            upload_artifact: true,
            artifact_name: 'test-report',
            artifact_retention_days: 90,
            fail_on_nonpassing: true
        }
    }
];

export const ValidXUnitArgsTests: IActionInputsXUnitArgsTest[] = [
    {
        title: 'generates with minimum valid input',
        inputs: [
            { name: 'path', value: '.' },
            { name: 'comment_on_pr', value: 'false' },
            { name: 'upload_artifact', value: 'false' },
            { name: 'fail_on_nonpassing', value: 'false' }
        ],
        output: [
            `--logger "trx;LogFileName=${XUNIT_RESULTS_FILENAME}`
        ]
    },
    {
        title: 'generates with additional args',
        inputs: [
            { name: 'path', value: '.' },
            { name: 'test_args', value: `-namespace "Mock.SomeNamespace"
-class "Mock.SomeNamespace.SomeClass"` },
            { name: 'comment_on_pr', value: 'false' },
            { name: 'upload_artifact', value: 'false' },
            { name: 'fail_on_nonpassing', value: 'false' }
        ],
        output: [
            `-namespace "Mock.SomeNamespace"`,
            `-class "Mock.SomeNamespace.SomeClass"`,
            `--logger "trx;LogFileName=${XUNIT_RESULTS_FILENAME}`
        ]
    },
    {
        title: 'generates kitchen sink',
        inputs: [
            { name: 'path', value: './MockProject.Tests' },
            { name: 'test_args', value: `-namespace "Mock.SomeNamespace"
-class "Mock.SomeNamespace.SomeClass"` },
            { name: 'comment_on_pr', value: 'false' },
            { name: 'upload_artifact', value: 'false' },
            { name: 'fail_on_nonpassing', value: 'false' }
        ],
        output: [
            `./MockProject.Tests`,
            `-namespace "Mock.SomeNamespace"`,
            `-class "Mock.SomeNamespace.SomeClass"`,
            `--logger "trx;LogFileName=${XUNIT_RESULTS_FILENAME}`
        ]
    },
    {
        title: 'generates kitchen sink as string',
        inputs: [
            { name: 'path', value: './MockProject.Tests' },
            { name: 'test_args', value: `-namespace "Mock.SomeNamespace"
-class "Mock.SomeNamespace.SomeClass"` },
            { name: 'comment_on_pr', value: 'false' },
            { name: 'upload_artifact', value: 'false' },
            { name: 'fail_on_nonpassing', value: 'false' }
        ],
        output: `./MockProject.Tests -namespace "Mock.SomeNamespace" -class "Mock.SomeNamespace.SomeClass" --logger "trx;LogFileName=${XUNIT_RESULTS_FILENAME}`
    }
];

/**
 * inputs.test.ts
 *
 * Invalid tests.
 */
export const InvalidInputsTests: IActionInputsTest[] = [
    {
        title: '"with" invalid "path" action input',
        inputs: [
            { name: 'path', value: '' }
        ],
        output: `The "path" input must be provided, and not empty.`
    },
    {
        title: '"with" invalid "github_token" action input when "comment_on_pr" enabled',
        inputs: [
            { name: 'path', value: '.' },
            { name: 'fail_on_nonpassing', value: 'false' },
            { name: 'comment_on_pr', value: 'true' },
            { name: 'upload_artifact', value: 'false' }
        ],
        output: `The "github_token" input must be provided when "comment_on_pr" is true.`
    },
    {
        title: '"with" invalid "artifact_name" action input when "upload_artifact" enabled',
        inputs: [
            { name: 'path', value: '.' },
            { name: 'fail_on_nonpassing', value: 'false' },
            { name: 'comment_on_pr', value: 'false' },
            { name: 'upload_artifact', value: 'true' },
            { name: 'artifact_name', value: '' }
        ],
        output: `The "artifact_name" input must be provided when "upload_artifact" is true.`
    }
]

/**
 * inputs.test.ts
 *
 * Valid pathing tests.
 */
export const ValidDirPathTests: IActionInputsPathTest[] = [
    {
        title: 'generates xunit output directory with minimum valid input',
        inputs: [
            { name: 'path', value: '.' },
            { name: 'comment_on_pr', value: 'false' },
            { name: 'upload_artifact', value: 'false' },
            { name: 'fail_on_nonpassing', value: 'false' }
        ],
        output: `${XUNIT_RESULTS_OUTPUT_DIR}`
    },
    {
        title: 'generates xunit output directory with specific project path',
        inputs: [
            { name: 'path', value: './MyProject.Tests' },
            { name: 'comment_on_pr', value: 'false' },
            { name: 'upload_artifact', value: 'false' },
            { name: 'fail_on_nonpassing', value: 'false' }
        ],
        output: `MyProject.Tests${path.sep}${XUNIT_RESULTS_OUTPUT_DIR}`
    }
]

export const ValidReportPathTests: IActionInputsPathTest[] = [
    {
        title: 'generates xunit output report path with minimum valid input',
        inputs: [
            { name: 'path', value: '.' },
            { name: 'comment_on_pr', value: 'false' },
            { name: 'upload_artifact', value: 'false' },
            { name: 'fail_on_nonpassing', value: 'false' }
        ],
        output: `${XUNIT_RESULTS_OUTPUT_DIR}${path.sep}${XUNIT_RESULTS_FILENAME}`
    },
    {
        title: 'generates xunit output report path with specific project path',
        inputs: [
            { name: 'path', value: './MyProject.Tests' },
            { name: 'comment_on_pr', value: 'false' },
            { name: 'upload_artifact', value: 'false' },
            { name: 'fail_on_nonpassing', value: 'false' }
        ],
        output: `MyProject.Tests${path.sep}${XUNIT_RESULTS_OUTPUT_DIR}${path.sep}${XUNIT_RESULTS_FILENAME}`
    }
]