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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BOLT_PROTOCOL_V5_0 = exports.BOLT_PROTOCOL_V4_4 = exports.BOLT_PROTOCOL_V4_3 = exports.BOLT_PROTOCOL_V4_2 = exports.BOLT_PROTOCOL_V4_1 = exports.BOLT_PROTOCOL_V4_0 = exports.BOLT_PROTOCOL_V3 = exports.BOLT_PROTOCOL_V2 = exports.BOLT_PROTOCOL_V1 = exports.DEFAULT_POOL_MAX_SIZE = exports.DEFAULT_POOL_ACQUISITION_TIMEOUT = exports.DEFAULT_CONNECTION_TIMEOUT_MILLIS = exports.ACCESS_MODE_WRITE = exports.ACCESS_MODE_READ = exports.FETCH_ALL = void 0;
var FETCH_ALL = -1;
exports.FETCH_ALL = FETCH_ALL;
var DEFAULT_POOL_ACQUISITION_TIMEOUT = 60 * 1000; // 60 seconds
exports.DEFAULT_POOL_ACQUISITION_TIMEOUT = DEFAULT_POOL_ACQUISITION_TIMEOUT;
var DEFAULT_POOL_MAX_SIZE = 100;
exports.DEFAULT_POOL_MAX_SIZE = DEFAULT_POOL_MAX_SIZE;
var DEFAULT_CONNECTION_TIMEOUT_MILLIS = 30000; // 30 seconds by default
exports.DEFAULT_CONNECTION_TIMEOUT_MILLIS = DEFAULT_CONNECTION_TIMEOUT_MILLIS;
var ACCESS_MODE_READ = 'READ';
exports.ACCESS_MODE_READ = ACCESS_MODE_READ;
var ACCESS_MODE_WRITE = 'WRITE';
exports.ACCESS_MODE_WRITE = ACCESS_MODE_WRITE;
var BOLT_PROTOCOL_V1 = 1;
exports.BOLT_PROTOCOL_V1 = BOLT_PROTOCOL_V1;
var BOLT_PROTOCOL_V2 = 2;
exports.BOLT_PROTOCOL_V2 = BOLT_PROTOCOL_V2;
var BOLT_PROTOCOL_V3 = 3;
exports.BOLT_PROTOCOL_V3 = BOLT_PROTOCOL_V3;
var BOLT_PROTOCOL_V4_0 = 4.0;
exports.BOLT_PROTOCOL_V4_0 = BOLT_PROTOCOL_V4_0;
var BOLT_PROTOCOL_V4_1 = 4.1;
exports.BOLT_PROTOCOL_V4_1 = BOLT_PROTOCOL_V4_1;
var BOLT_PROTOCOL_V4_2 = 4.2;
exports.BOLT_PROTOCOL_V4_2 = BOLT_PROTOCOL_V4_2;
var BOLT_PROTOCOL_V4_3 = 4.3;
exports.BOLT_PROTOCOL_V4_3 = BOLT_PROTOCOL_V4_3;
var BOLT_PROTOCOL_V4_4 = 4.4;
exports.BOLT_PROTOCOL_V4_4 = BOLT_PROTOCOL_V4_4;
var BOLT_PROTOCOL_V5_0 = 5.0;
exports.BOLT_PROTOCOL_V5_0 = BOLT_PROTOCOL_V5_0;