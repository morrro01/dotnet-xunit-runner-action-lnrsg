/**
 * Object containing a result summary of XUnit tests as parsed from the ResultSummary
 * element of an XUnit result XML file.
 */
export interface IResult {

    /**
     * @memberof IResult
     * 
     * Total number of tests found by XUnit.
     */
    total: number;

    /**
     * @memberof IResult
     * 
     * Total number of tests executed by XUnit.
     */
    executed: number;

    /**
     * @memberof IResult
     * 
     * Total number of passing tests.
     */
    passed: number;

    /**
     * @memberof IResult
     * 
     * Total number of inconclusive tests.
     */
    inconclusive: number;

    /**
     * @memberof IResult
     * 
     * Total number of failed tests.
     */
    failed: number;

    /**
     * @memberof IResult
     * 
     * Total number of tests that errored during execution.
     */
    error: number;

    /**
     * @memberof IResult
     * 
     * Total  number of tests that resulted in a warning during execution.
     */
    warning: number;
}