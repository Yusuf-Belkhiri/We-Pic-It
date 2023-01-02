"use strict";
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
/* eslint-disable @typescript-eslint/promise-function-async */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Interface which defines the raw connection with the database
 * @private
 */
var Connection = /** @class */ (function () {
    function Connection() {
    }
    Object.defineProperty(Connection.prototype, "id", {
        get: function () {
            return '';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Connection.prototype, "databaseId", {
        get: function () {
            return '';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Connection.prototype, "server", {
        get: function () {
            return {};
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Connection.prototype, "address", {
        /**
         * @property {ServerAddress} the server address this connection is opened against
         */
        get: function () {
            return undefined;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Connection.prototype, "version", {
        /**
         * @property {ServerVersion} the version of the server this connection is connected to
         */
        get: function () {
            return undefined;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * @returns {boolean} whether this connection is in a working condition
     */
    Connection.prototype.isOpen = function () {
        return false;
    };
    /**
     * @todo be removed and internalize the methods
     * @returns {any} the underlying bolt protocol assigned to this connection
     */
    Connection.prototype.protocol = function () {
        throw Error('Not implemented');
    };
    /**
     * Connect to the target address, negotiate Bolt protocol and send initialization message.
     * @param {string} userAgent the user agent for this driver.
     * @param {Object} authToken the object containing auth information.
     * @return {Promise<Connection>} promise resolved with the current connection if connection is successful. Rejected promise otherwise.
     */
    Connection.prototype.connect = function (userAgent, authToken) {
        throw Error('Not implemented');
    };
    /**
     * Write a message to the network channel.
     * @param {RequestMessage} message the message to write.
     * @param {ResultStreamObserver} observer the response observer.
     * @param {boolean} flush `true` if flush should happen after the message is written to the buffer.
     */
    Connection.prototype.write = function (message, observer, flush) {
        throw Error('Not implemented');
    };
    /**
     * Send a RESET-message to the database. Message is immediately flushed to the network.
     * @return {Promise<void>} promise resolved when SUCCESS-message response arrives, or failed when other response messages arrives.
     */
    Connection.prototype.resetAndFlush = function () {
        throw Error('Not implemented');
    };
    /**
     * Checks if there is an ongoing request being handled
     * @return {boolean} `true` if there is an ongoing request being handled
     */
    Connection.prototype.hasOngoingObservableRequests = function () {
        throw Error('Not implemented');
    };
    /**
     * Call close on the channel.
     * @returns {Promise<void>} - A promise that will be resolved when the connection is closed.
     *
     */
    Connection.prototype.close = function () {
        throw Error('Not implemented');
    };
    /**
     * Called to release the connection
     */
    Connection.prototype._release = function () {
        return Promise.resolve();
    };
    return Connection;
}());
exports.default = Connection;
