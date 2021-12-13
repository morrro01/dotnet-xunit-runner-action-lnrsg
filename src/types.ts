/**
 * Defines the parsed action input parameters.
 */
export interface IActionInputs {

    /**
     * @memberof IActionInputs
     * 
     * GitHub API token with repository access.
     */
    github_token: string;

    /**
     * @memberof IActionInputs
     *
     * Workspace path containing the .NET project to run XUnit against.
     */
    path: string;

    /**
     * @memberof IActionInputs
     *
     * Additional arguments passed to XUnit.
     */
    test_args?: string[];

    /**
     * @memberof IActionInputs
     *
     * Whether to comment Pull Requests with the test summary; one of: true, false.
     */
    comment_on_pr: boolean;

    /**
     * @memberof IActionInputs
     *
     * Title of Pull Request comments, if enabled.
     */
    comment_title: string;

    /**
     * @memberof IActionInputs
     *
     * Whether to upload the generated test result as an artifact; one of: true, false.
     */
    upload_artifact: boolean;

    /**
     * @memberof IActionInputs
     *
     * Name given to the uploaded test report artifact, if enabled.
     */
    artifact_name: string;

    /**
     * @memberof IActionInputs
     *
     * Number of days to retain the uploaded XUnit result artifact, if enabled.
     */
    artifact_retention_days: number;

    /**
     * @memberof IActionInputs
     * 
     * Whether to fail the action in the presence of non-passing tests; one of: true, false.
     */
    fail_on_nonpassing: boolean;
}