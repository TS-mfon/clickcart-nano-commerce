// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface Vm {
    function envOr(string calldata name, address defaultValue) external returns (address);
    function startBroadcast() external;
    function stopBroadcast() external;
}

contract Script {
    Vm internal constant vm = Vm(address(uint160(uint256(keccak256("hevm cheat code")))));
}
