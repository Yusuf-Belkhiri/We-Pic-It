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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stats = exports.QueryStatistics = exports.ProfiledPlan = exports.Plan = exports.Notification = exports.ServerInfo = exports.queryType = void 0;
var integer_1 = __importStar(require("./integer"));
/**
 * A ResultSummary instance contains structured metadata for a {@link Result}.
 * @access public
 */
var ResultSummary = /** @class */ (function () {
    /**
     * @constructor
     * @param {string} query - The query this summary is for
     * @param {Object} parameters - Parameters for the query
     * @param {Object} metadata - Query metadata
     * @param {number|undefined} protocolVersion - Bolt Protocol Version
     */
    function ResultSummary(query, parameters, metadata, protocolVersion) {
        var _a, _b, _c;
        /**
         * The query and parameters this summary is for.
         * @type {{text: string, parameters: Object}}
         * @public
         */
        this.query = { text: query, parameters: parameters };
        /**
         * The type of query executed. Can be "r" for read-only query, "rw" for read-write query,
         * "w" for write-only query and "s" for schema-write query.
         * String constants are available in {@link queryType} object.
         * @type {string}
         * @public
         */
        this.queryType = metadata.type;
        /**
         * Counters for operations the query triggered.
         * @type {QueryStatistics}
         * @public
         */
        this.counters = new QueryStatistics((_a = metadata.stats) !== null && _a !== void 0 ? _a : {});
        // for backwards compatibility, remove in future version
        /**
         * Use {@link ResultSummary.counters} instead.
         * @type {QueryStatistics}
         * @deprecated
         */
        this.updateStatistics = this.counters;
        /**
         * This describes how the database will execute the query.
         * Query plan for the executed query if available, otherwise undefined.
         * Will only be populated for queries that start with "EXPLAIN".
         * @type {Plan|false}
         * @public
         */
        this.plan =
            metadata.plan != null || metadata.profile != null
                ? new Plan((_b = metadata.plan) !== null && _b !== void 0 ? _b : metadata.profile)
                : false;
        /**
         * This describes how the database did execute your query. This will contain detailed information about what
         * each step of the plan did. Profiled query plan for the executed query if available, otherwise undefined.
         * Will only be populated for queries that start with "PROFILE".
         * @type {ProfiledPlan}
         * @public
         */
        this.profile = metadata.profile != null ? new ProfiledPlan(metadata.profile) : false;
        /**
         * An array of notifications that might arise when executing the query. Notifications can be warnings about
         * problematic queries or other valuable information that can be presented in a client. Unlike failures
         * or errors, notifications do not affect the execution of a query.
         * @type {Array<Notification>}
         * @public
         */
        this.notifications = this._buildNotifications(metadata.notifications);
        /**
         * The basic information of the server where the result is obtained from.
         * @type {ServerInfo}
         * @public
         */
        this.server = new ServerInfo(metadata.server, protocolVersion);
        /**
         * The time it took the server to consume the result.
         * @type {number}
         * @public
         */
        this.resultConsumedAfter = metadata.result_consumed_after;
        /**
         * The time it took the server to make the result available for consumption in milliseconds.
         * @type {number}
         * @public
         */
        this.resultAvailableAfter = metadata.result_available_after;
        /**
         * The database name where this summary is obtained from.
         * @type {{name: string}}
         * @public
         */
        this.database = { name: (_c = metadata.db) !== null && _c !== void 0 ? _c : null };
    }
    ResultSummary.prototype._buildNotifications = function (notifications) {
        if (notifications == null) {
            return [];
        }
        return notifications.map(function (n) {
            return new Notification(n);
        });
    };
    /**
     * Check if the result summary has a plan
     * @return {boolean}
     */
    ResultSummary.prototype.hasPlan = function () {
        return this.plan instanceof Plan;
    };
    /**
     * Check if the result summary has a profile
     * @return {boolean}
     */
    ResultSummary.prototype.hasProfile = function () {
        return this.profile instanceof ProfiledPlan;
    };
    return ResultSummary;
}());
/**
 * Class for execution plan received by prepending Cypher with EXPLAIN.
 * @access public
 */
var Plan = /** @class */ (function () {
    /**
     * Create a Plan instance
     * @constructor
     * @param {Object} plan - Object with plan data
     */
    function Plan(plan) {
        this.operatorType = plan.operatorType;
        this.identifiers = plan.identifiers;
        this.arguments = plan.args;
        this.children = plan.children != null
            ? plan.children.map(function (child) { return new Plan(child); })
            : [];
    }
    return Plan;
}());
exports.Plan = Plan;
/**
 * Class for execution plan received by prepending Cypher with PROFILE.
 * @access public
 */
var ProfiledPlan = /** @class */ (function () {
    /**
     * Create a ProfiledPlan instance
     * @constructor
     * @param {Object} profile - Object with profile data
     */
    function ProfiledPlan(profile) {
        this.operatorType = profile.operatorType;
        this.identifiers = profile.identifiers;
        this.arguments = profile.args;
        this.dbHits = valueOrDefault('dbHits', profile);
        this.rows = valueOrDefault('rows', profile);
        this.pageCacheMisses = valueOrDefault('pageCacheMisses', profile);
        this.pageCacheHits = valueOrDefault('pageCacheHits', profile);
        this.pageCacheHitRatio = valueOrDefault('pageCacheHitRatio', profile);
        this.time = valueOrDefault('time', profile);
        this.children = profile.children != null
            ? profile.children.map(function (child) { return new ProfiledPlan(child); })
            : [];
    }
    ProfiledPlan.prototype.hasPageCacheStats = function () {
        return (this.pageCacheMisses > 0 ||
            this.pageCacheHits > 0 ||
            this.pageCacheHitRatio > 0);
    };
    return ProfiledPlan;
}());
exports.ProfiledPlan = ProfiledPlan;
/**
 * Stats Query statistics dictionary for a {@link QueryStatistics}
 * @public
 */
var Stats = /** @class */ (function () {
    /**
     * @constructor
     * @private
     */
    function Stats() {
        /**
         * nodes created
         * @type {number}
         * @public
         */
        this.nodesCreated = 0;
        /**
         * nodes deleted
         * @type {number}
         * @public
         */
        this.nodesDeleted = 0;
        /**
         * relationships created
         * @type {number}
         * @public
         */
        this.relationshipsCreated = 0;
        /**
         * relationships deleted
         * @type {number}
         * @public
         */
        this.relationshipsDeleted = 0;
        /**
         * properties set
         * @type {number}
         * @public
         */
        this.propertiesSet = 0;
        /**
         * labels added
         * @type {number}
         * @public
         */
        this.labelsAdded = 0;
        /**
         * labels removed
         * @type {number}
         * @public
         */
        this.labelsRemoved = 0;
        /**
         * indexes added
         * @type {number}
         * @public
         */
        this.indexesAdded = 0;
        /**
         * indexes removed
         * @type {number}
         * @public
         */
        this.indexesRemoved = 0;
        /**
         * constraints added
         * @type {number}
         * @public
         */
        this.constraintsAdded = 0;
        /**
         * constraints removed
         * @type {number}
         * @public
         */
        this.constraintsRemoved = 0;
    }
    return Stats;
}());
exports.Stats = Stats;
/**
 * Get statistical information for a {@link Result}.
 * @access public
 */
var QueryStatistics = /** @class */ (function () {
    /**
     * Structurize the statistics
     * @constructor
     * @param {Object} statistics - Result statistics
     */
    function QueryStatistics(statistics) {
        var _this = this;
        this._stats = {
            nodesCreated: 0,
            nodesDeleted: 0,
            relationshipsCreated: 0,
            relationshipsDeleted: 0,
            propertiesSet: 0,
            labelsAdded: 0,
            labelsRemoved: 0,
            indexesAdded: 0,
            indexesRemoved: 0,
            constraintsAdded: 0,
            constraintsRemoved: 0
        };
        this._systemUpdates = 0;
        Object.keys(statistics).forEach(function (index) {
            // To camelCase
            var camelCaseIndex = index.replace(/(-\w)/g, function (m) { return m[1].toUpperCase(); });
            if (camelCaseIndex in _this._stats) {
                _this._stats[camelCaseIndex] = intValue(statistics[index]);
            }
            else if (camelCaseIndex === 'systemUpdates') {
                _this._systemUpdates = intValue(statistics[index]);
            }
            else if (camelCaseIndex === 'containsSystemUpdates') {
                _this._containsSystemUpdates = statistics[index];
            }
            else if (camelCaseIndex === 'containsUpdates') {
                _this._containsUpdates = statistics[index];
            }
        });
        this._stats = Object.freeze(this._stats);
    }
    /**
     * Did the database get updated?
     * @return {boolean}
     */
    QueryStatistics.prototype.containsUpdates = function () {
        var _this = this;
        return this._containsUpdates !== undefined
            ? this._containsUpdates
            : (Object.keys(this._stats).reduce(function (last, current) {
                return last + _this._stats[current];
            }, 0) > 0);
    };
    /**
     * Returns the query statistics updates in a dictionary.
     * @returns {Stats}
     */
    QueryStatistics.prototype.updates = function () {
        return this._stats;
    };
    /**
     * Return true if the system database get updated, otherwise false
     * @returns {boolean} - If the system database get updated or not.
     */
    QueryStatistics.prototype.containsSystemUpdates = function () {
        return this._containsSystemUpdates !== undefined
            ? this._containsSystemUpdates
            : this._systemUpdates > 0;
    };
    /**
     * @returns {number} - Number of system updates
     */
    QueryStatistics.prototype.systemUpdates = function () {
        return this._systemUpdates;
    };
    return QueryStatistics;
}());
exports.QueryStatistics = QueryStatistics;
/**
 * Class for Cypher notifications
 * @access public
 */
var Notification = /** @class */ (function () {
    /**
     * Create a Notification instance
     * @constructor
     * @param {Object} notification - Object with notification data
     */
    function Notification(notification) {
        this.code = notification.code;
        this.title = notification.title;
        this.description = notification.description;
        this.severity = notification.severity;
        this.position = Notification._constructPosition(notification.position);
    }
    Notification._constructPosition = function (pos) {
        if (pos == null) {
            return {};
        }
        /* eslint-disable @typescript-eslint/no-non-null-assertion */
        return {
            offset: intValue(pos.offset),
            line: intValue(pos.line),
            column: intValue(pos.column)
        };
        /* eslint-enable @typescript-eslint/no-non-null-assertion */
    };
    return Notification;
}());
exports.Notification = Notification;
/**
 * Class for exposing server info from a result.
 * @access public
 */
var ServerInfo = /** @class */ (function () {
    /**
     * Create a ServerInfo instance
     * @constructor
     * @param {Object} serverMeta - Object with serverMeta data
     * @param {Object} connectionInfo - Bolt connection info
     * @param {number} protocolVersion - Bolt Protocol Version
     */
    function ServerInfo(serverMeta, protocolVersion) {
        if (serverMeta != null) {
            /**
             * The server adress
             * @type {string}
             * @public
             */
            this.address = serverMeta.address;
            /**
             * The server user agent string
             * @type {string}
             * @public
             */
            this.agent = serverMeta.version;
        }
        /**
         * The protocol version used by the connection
         * @type {number}
         * @public
         */
        this.protocolVersion = protocolVersion;
    }
    return ServerInfo;
}());
exports.ServerInfo = ServerInfo;
function intValue(value) {
    if (value instanceof integer_1.default) {
        return value.toInt();
    }
    else if (typeof value === 'bigint') {
        return (0, integer_1.int)(value).toInt();
    }
    else {
        return value;
    }
}
function valueOrDefault(key, values, defaultValue) {
    if (defaultValue === void 0) { defaultValue = 0; }
    if (values !== false && key in values) {
        var value = values[key];
        return intValue(value);
    }
    else {
        return defaultValue;
    }
}
/**
 * The constants for query types
 * @type {{SCHEMA_WRITE: string, WRITE_ONLY: string, READ_ONLY: string, READ_WRITE: string}}
 */
var queryType = {
    READ_ONLY: 'r',
    READ_WRITE: 'rw',
    WRITE_ONLY: 'w',
    SCHEMA_WRITE: 's'
};
exports.queryType = queryType;
exports.default = ResultSummary;
