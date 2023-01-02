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
import Result from './result';
import Transaction from './transaction';
import { ConnectionHolder } from './internal/connection-holder';
import { Bookmarks } from './internal/bookmarks';
import { TxConfig } from './internal/tx-config';
import ConnectionProvider from './connection-provider';
import { Query, SessionMode } from './types';
import Connection from './connection';
import { NumberOrInteger } from './graph-types';
import TransactionPromise from './transaction-promise';
import ManagedTransaction from './transaction-managed';
import BookmarkManager from './bookmark-manager';
import { Dict } from './record';
declare type ConnectionConsumer = (connection: Connection | null) => any | undefined | Promise<any> | Promise<undefined>;
declare type TransactionWork<T> = (tx: Transaction) => Promise<T> | T;
declare type ManagedTransactionWork<T> = (tx: ManagedTransaction) => Promise<T> | T;
interface TransactionConfig {
    timeout?: NumberOrInteger;
    metadata?: object;
}
/**
 * A Session instance is used for handling the connection and
 * sending queries through the connection.
 * In a single session, multiple queries will be executed serially.
 * In order to execute parallel queries, multiple sessions are required.
 * @access public
 */
declare class Session {
    private readonly _mode;
    private _database;
    private readonly _reactive;
    private readonly _fetchSize;
    private readonly _readConnectionHolder;
    private readonly _writeConnectionHolder;
    private _open;
    private _hasTx;
    private _lastBookmarks;
    private _configuredBookmarks;
    private readonly _transactionExecutor;
    private readonly _impersonatedUser?;
    private _databaseNameResolved;
    private readonly _lowRecordWatermark;
    private readonly _highRecordWatermark;
    private readonly _results;
    private readonly _bookmarkManager?;
    /**
     * @constructor
     * @protected
     * @param {Object} args
     * @param {string} args.mode the default access mode for this session.
     * @param {ConnectionProvider} args.connectionProvider - The connection provider to acquire connections from.
     * @param {Bookmarks} args.bookmarks - The initial bookmarks for this session.
     * @param {string} args.database the database name
     * @param {Object} args.config={} - This driver configuration.
     * @param {boolean} args.reactive - Whether this session should create reactive streams
     * @param {number} args.fetchSize - Defines how many records is pulled in each pulling batch
     * @param {string} args.impersonatedUser - The username which the user wants to impersonate for the duration of the session.
     */
    constructor({ mode, connectionProvider, bookmarks, database, config, reactive, fetchSize, impersonatedUser, bookmarkManager }: {
        mode: SessionMode;
        connectionProvider: ConnectionProvider;
        bookmarks?: Bookmarks;
        database: string;
        config: any;
        reactive: boolean;
        fetchSize: number;
        impersonatedUser?: string;
        bookmarkManager?: BookmarkManager;
    });
    /**
     * Run Cypher query
     * Could be called with a query object i.e.: `{text: "MATCH ...", parameters: {param: 1}}`
     * or with the query and parameters as separate arguments.
     *
     * @public
     * @param {mixed} query - Cypher query to execute
     * @param {Object} parameters - Map with parameters to use in query
     * @param {TransactionConfig} [transactionConfig] - Configuration for the new auto-commit transaction.
     * @return {Result} New Result.
     */
    run<RecordShape extends Dict = Dict>(query: Query, parameters?: any, transactionConfig?: TransactionConfig): Result<RecordShape>;
    _run(query: Query, parameters: any, customRunner: ConnectionConsumer): Result;
    _acquireConnection(connectionConsumer: ConnectionConsumer): Promise<Connection>;
    /**
     * Begin a new transaction in this session. A session can have at most one transaction running at a time, if you
     * want to run multiple concurrent transactions, you should use multiple concurrent sessions.
     *
     * While a transaction is open the session cannot be used to run queries outside the transaction.
     *
     * @param {TransactionConfig} [transactionConfig] - Configuration for the new auto-commit transaction.
     * @returns {TransactionPromise} New Transaction.
     */
    beginTransaction(transactionConfig?: TransactionConfig): TransactionPromise;
    _beginTransaction(accessMode: SessionMode, txConfig: TxConfig): TransactionPromise;
    /**
     * @private
     * @returns {void}
     */
    _assertSessionIsOpen(): void;
    /**
     * @private
     * @returns {void}
     */
    _transactionClosed(): void;
    /**
     * Return the bookmarks received following the last completed {@link Transaction}.
     *
     * @deprecated This method will be removed in version 6.0. Please, use {@link Session#lastBookmarks} instead.
     *
     * @return {string[]} A reference to a previous transaction.
     */
    lastBookmark(): string[];
    /**
     * Return the bookmarks received following the last completed {@link Transaction}.
     *
     * @return {string[]} A reference to a previous transaction.
     */
    lastBookmarks(): string[];
    private _bookmarks;
    /**
     * Execute given unit of work in a {@link READ} transaction.
     *
     * Transaction will automatically be committed unless the given function throws or returns a rejected promise.
     * Some failures of the given function or the commit itself will be retried with exponential backoff with initial
     * delay of 1 second and maximum retry time of 30 seconds. Maximum retry time is configurable via driver config's
     * `maxTransactionRetryTime` property in milliseconds.
     *
     * @deprecated This method will be removed in version 6.0. Please, use {@link Session#executeRead} instead.
     *
     * @param {function(tx: Transaction): Promise} transactionWork - Callback that executes operations against
     * a given {@link Transaction}.
     * @param {TransactionConfig} [transactionConfig] - Configuration for all transactions started to execute the unit of work.
     * @return {Promise} Resolved promise as returned by the given function or rejected promise when given
     * function or commit fails.
     */
    readTransaction<T>(transactionWork: TransactionWork<T>, transactionConfig?: TransactionConfig): Promise<T>;
    /**
     * Execute given unit of work in a {@link WRITE} transaction.
     *
     * Transaction will automatically be committed unless the given function throws or returns a rejected promise.
     * Some failures of the given function or the commit itself will be retried with exponential backoff with initial
     * delay of 1 second and maximum retry time of 30 seconds. Maximum retry time is configurable via driver config's
     * `maxTransactionRetryTime` property in milliseconds.
     *
     * @deprecated This method will be removed in version 6.0. Please, use {@link Session#executeWrite} instead.
     *
     * @param {function(tx: Transaction): Promise} transactionWork - Callback that executes operations against
     * a given {@link Transaction}.
     * @param {TransactionConfig} [transactionConfig] - Configuration for all transactions started to execute the unit of work.
     * @return {Promise} Resolved promise as returned by the given function or rejected promise when given
     * function or commit fails.
     */
    writeTransaction<T>(transactionWork: TransactionWork<T>, transactionConfig?: TransactionConfig): Promise<T>;
    _runTransaction<T>(accessMode: SessionMode, transactionConfig: TxConfig, transactionWork: TransactionWork<T>): Promise<T>;
    /**
     * Execute given unit of work in a {@link READ} transaction.
     *
     * Transaction will automatically be committed unless the given function throws or returns a rejected promise.
     * Some failures of the given function or the commit itself will be retried with exponential backoff with initial
     * delay of 1 second and maximum retry time of 30 seconds. Maximum retry time is configurable via driver config's
     * `maxTransactionRetryTime` property in milliseconds.
     *
     * @param {function(tx: ManagedTransaction): Promise} transactionWork - Callback that executes operations against
     * a given {@link Transaction}.
     * @param {TransactionConfig} [transactionConfig] - Configuration for all transactions started to execute the unit of work.
     * @return {Promise} Resolved promise as returned by the given function or rejected promise when given
     * function or commit fails.
     */
    executeRead<T>(transactionWork: ManagedTransactionWork<T>, transactionConfig?: TransactionConfig): Promise<T>;
    /**
     * Execute given unit of work in a {@link WRITE} transaction.
     *
     * Transaction will automatically be committed unless the given function throws or returns a rejected promise.
     * Some failures of the given function or the commit itself will be retried with exponential backoff with initial
     * delay of 1 second and maximum retry time of 30 seconds. Maximum retry time is configurable via driver config's
     * `maxTransactionRetryTime` property in milliseconds.
     *
     * @param {function(tx: ManagedTransaction): Promise} transactionWork - Callback that executes operations against
     * a given {@link Transaction}.
     * @param {TransactionConfig} [transactionConfig] - Configuration for all transactions started to execute the unit of work.
     * @return {Promise} Resolved promise as returned by the given function or rejected promise when given
     * function or commit fails.
     */
    executeWrite<T>(transactionWork: ManagedTransactionWork<T>, transactionConfig?: TransactionConfig): Promise<T>;
    /**
     * @private
     * @param {SessionMode} accessMode
     * @param {TxConfig} transactionConfig
     * @param {ManagedTransactionWork} transactionWork
     * @returns {Promise}
     */
    private _executeInTransaction;
    /**
     * Sets the resolved database name in the session context.
     * @private
     * @param {string|undefined} database The resolved database name
     * @returns {void}
     */
    _onDatabaseNameResolved(database?: string): void;
    private _getConnectionAcquistionBookmarks;
    /**
     * Update value of the last bookmarks.
     * @private
     * @param {Bookmarks} newBookmarks - The new bookmarks.
     * @returns {void}
     */
    _updateBookmarks(newBookmarks?: Bookmarks, previousBookmarks?: Bookmarks, database?: string): void;
    /**
     * Close this session.
     * @return {Promise}
     */
    close(): Promise<void>;
    _connectionHolderWithMode(mode: SessionMode): ConnectionHolder;
    /**
     * @private
     * @param {Object} meta Connection metadatada
     * @returns {void}
     */
    _onCompleteCallback(meta: {
        bookmark: string | string[];
        db?: string;
    }, previousBookmarks?: Bookmarks): void;
    /**
     * @private
     * @returns {void}
     */
    private _calculateWatermaks;
    /**
     * @protected
     */
    static _validateSessionMode(rawMode?: SessionMode): SessionMode;
}
export default Session;
export type { TransactionConfig };
