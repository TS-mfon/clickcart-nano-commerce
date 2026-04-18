// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/DemoReceiptLog.sol";

contract Deploy is Script {
    function run() external returns (DemoReceiptLog receiptLog) {
        address reporter = vm.envOr("REPORTER_ADDRESS", address(0));
        vm.startBroadcast();
        receiptLog = new DemoReceiptLog(reporter);
        vm.stopBroadcast();
    }
}
