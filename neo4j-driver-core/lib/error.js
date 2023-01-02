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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROTOCOL_ERROR = exports.SESSION_EXPIRED = exports.SERVICE_UNAVAILABLE = exports.Neo4jError = exports.isRetriableError = exports.newError = void 0;
// A common place for constructing error objects, to keep them
// uniform across the driver surface.
/**
 * Error code representing complete loss of service. Used by {@link Neo4jError#code}.
 * @type {string}
 */
var SERVICE_UNAVAILABLE = 'ServiceUnavailable';
exports.SERVICE_UNAVAILABLE = SERVICE_UNAVAILABLE;
/**
 * Error code representing transient loss of service. Used by {@link Neo4jError#code}.
 * @type {string}
 */
var SESSION_EXPIRED = 'SessionExpired';
exports.SESSION_EXPIRED = SESSION_EXPIRED;
/**
 * Error code representing serialization/deserialization issue in the Bolt protocol. Used by {@link Neo4jError#code}.
 * @type {string}
 */
var PROTOCOL_ERROR = 'ProtocolError';
exports.PROTOCOL_ERROR = PROTOCOL_ERROR;
/**
 * Error code representing an no classified error. Used by {@link Neo4jError#code}.
 * @type {string}
 */
var NOT_AVAILABLE = 'N/A';
/// TODO: Remove definitions of this.constructor and this.__proto__
/**
 * Class for all errors thrown/returned by the driver.
 */
var Neo4jError = /** @class */ (function (_super) {
    __extends(Neo4jError, _super);
    /**
     * @constructor
     * @param {string} message - the error message
     * @param {string} code - Optional error code. Will be populated when error originates in the database.
     */
    function Neo4jError(message, code, cause) {
        var _this = 
        // eslint-disable-next-line
        // @ts-ignore: not available in ES6 yet
        _super.call(this, message, cause != null ? { cause: cause } : undefined) || this;
        _this.constructor = Neo4jError;
        // eslint-disable-next-line no-proto
        _this.__proto__ = Neo4jError.prototype;
        _this.code = code;
        _this.name = 'Neo4jError';
        /**
         * Indicates if the error is retriable.
         * @type {boolean} - true if the error is retriable
         */
        _this.retriable = _isRetriableCode(code);
        return _this;
    }
    /**
     * Verifies if the given error is retriable.
     *
     * @param {object|undefined|null} error the error object
     * @returns {boolean} true if the error is retriable
     */
    Neo4jError.isRetriable = function (error) {
        return error !== null &&
            error !== undefined &&
            error instanceof Neo4jError &&
            error.retriable;
    };
    return Neo4jError;
}(Error));
exports.Neo4jError = Neo4jError;
/**
 * Create a new error from a message and error code
 * @param message the error message
 * @param code the error code
 * @return {Neo4jError} an {@link Neo4jError}
 * @private
 */
function newError(message, code, cause) {
    return new Neo4jError(message, code !== null && code !== void 0 ? code : NOT_AVAILABLE, cause);
}
exports.newError = newError;
/**
 * Verifies if the given error is retriable.
 *
 * @public
 * @param {object|undefined|null} error the error object
 * @returns {boolean} true if the error is retriable
 */
var isRetriableError = Neo4jError.isRetriable;
exports.isRetriableError = isRetriableError;
/**
 * @private
 * @param {string} code the error code
 * @returns {boolean} true if the error is a retriable error
 */
function _isRetriableCode(code) {
    return code === SERVICE_UNAVAILABLE ||
        code === SESSION_EXPIRED ||
        _isAuthorizationExpired(code) ||
        _isTransientError(code);
}
/**
 * @private
 * @param {string} code the error to check
 * @return {boolean} true if the error is a transient error
 */
function _isTransientError(code) {
    return (code === null || code === void 0 ? void 0 : code.includes('TransientError')) === true;
}
/**
 * @private
 * @param {string} code the error to check
 * @returns {boolean} true if the error is a service unavailable error
 */
function _isAuthorizationExpired(code) {
    return code === 'Neo.ClientError.Security.AuthorizationExpired';
}
