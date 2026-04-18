// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/DemoReceiptLog.sol";

contract DemoReceiptLogTest is Test {
    DemoReceiptLog log;

    function setUp() public {
        log = new DemoReceiptLog(address(this));
    }

    function testReportPaidAction() public {
        log.reportPaidAction(bytes32("project"), bytes32("action"), address(0xBEEF), address(0xCAFE), 1000, bytes32("resource"), bytes32("payment"));
    }

    function testRejectsZeroAmount() public {
        vm.expectRevert(DemoReceiptLog.InvalidAction.selector);
        log.reportPaidAction(bytes32("project"), bytes32("action"), address(0xBEEF), address(0xCAFE), 0, bytes32("resource"), bytes32("payment"));
    }
}
