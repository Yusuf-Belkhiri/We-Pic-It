/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 *
 * This file is part of Neo4j.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import Transaction from './transaction';
import { ConnectionHolder } from './internal/connection-holder';
import { Bookmarks } from './internal/bookmarks';
import { TxConfig } from './internal/tx-config';
/**
 * Represents a {@link Promise<Transaction>} object and a {@link Transaction} object.
 *
 * Resolving this object promise verifies the result of the transaction begin and returns the {@link Transaction} object in case of success.
 *
 * The object can still also used as {@link Transaction} for convenience. The result of begin will be checked
 * during the next API calls in the object as it is in the transaction.
 *
 * @access public
 */
declare class TransactionPromise extends Transaction implements Promise<Transaction> {
    [Symbol.toStringTag]: string;
    private _beginError?;
    private _beginMetadata?;
    private _beginPromise?;
    private _reject?;
    private _resolve?;
    /**
     * @constructor
     * @param {ConnectionHolder} connectionHolder - the connection holder to get connection from.
     * @param {function()} onClose - Function to be called when transaction is committed or rolled back.
     * @param {function(bookmarks: Bookmarks)} onBookmarks callback invoked when new bookmark is produced.
     * @param {function()} onConnection - Function to be called when a connection is obtained to ensure the connection
     * is not yet released.
     * @param {boolean} reactive whether this transaction generates reactive streams
     * @param {number} fetchSize - the record fetch size in each pulling batch.
     * @param {string} impersonatedUser - The name of the user which should be impersonated for the duration of the session.
     */
    constructor({ connectionHolder, onClose, onBookmarks, onConnection, reactive, fetchSize, impersonatedUser, highRecordWatermark, lowRecordWatermark }: {
        connectionHolder: ConnectionHolder;
        onClose: () => void;
        onBookmarks: (newBookmarks: Bookmarks, previousBookmarks: Bookmarks, database?: string) => void;
        onConnection: () => void;
        reactive: boolean;
        fetchSize: number;
        impersonatedUser?: string;
        highRecordWatermark: number;
        lowRecordWatermark: number;
    });
    /**
     * Waits for the begin to complete.
     *
     * @param {function(transaction: Transaction)} onFulfilled - function to be called when finished.
     * @param {function(error: {message:string, code:string})} onRejected - function to be called upon errors.
     * @return {Promise} promise.
     */
    then<TResult1 = Transaction, TResult2 = never>(onfulfilled?: ((value: Transaction) => TResult1 | PromiseLike<TResult1>) | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null): Promise<TResult1 | TResult2>;
    /**
     * Catch errors when using promises.
     *
     * @param {function(error: Neo4jError)} onRejected - Function to be called upon errors.
     * @return {Promise} promise.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null): Promise<any>;
    /**
     * Called when finally the begin is done
     *
     * @param {function()|null} onfinally - function when the promise finished
     * @return {Promise} promise.
     */
    finally(onfinally?: (() => void) | null): Promise<Transaction>;
    private _getOrCreateBeginPromise;
    /**
     * @access private
     */
    private _toTransaction;
    /**
     * @access private
     */
    _begin(bookmarks: () => Promise<Bookmarks>, txConfig: TxConfig): void;
    /**
     * @access private
     * @returns {void}
     */
    private _onBeginError;
    /**
     * @access private
     * @returns {void}
     */
    private _onBeginMetadata;
}
export default TransactionPromise;
