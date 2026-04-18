// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract DemoReceiptLog {
    address public owner;
    mapping(address => bool) public reporters;

    event ReporterSet(address indexed reporter, bool allowed);
    event PaidAction(
        bytes32 indexed projectId,
        bytes32 indexed actionId,
        address indexed buyer,
        address seller,
        uint256 amountMicrousd,
        bytes32 resourceId,
        bytes32 paymentHash,
        uint256 timestamp
    );

    error NotAuthorized();
    error InvalidAction();

    constructor(address initialReporter) {
        owner = msg.sender;
        reporters[msg.sender] = true;
        if (initialReporter != address(0)) {
            reporters[initialReporter] = true;
        }
    }

    modifier onlyReporter() {
        if (!reporters[msg.sender]) revert NotAuthorized();
        _;
    }

    function setReporter(address reporter, bool allowed) external {
        if (msg.sender != owner) revert NotAuthorized();
        reporters[reporter] = allowed;
        emit ReporterSet(reporter, allowed);
    }

    function reportPaidAction(
        bytes32 projectId,
        bytes32 actionId,
        address buyer,
        address seller,
        uint256 amountMicrousd,
        bytes32 resourceId,
        bytes32 paymentHash
    ) external onlyReporter {
        if (actionId == bytes32(0) || amountMicrousd == 0) revert InvalidAction();
        emit PaidAction(projectId, actionId, buyer, seller, amountMicrousd, resourceId, paymentHash, block.timestamp);
    }
}
