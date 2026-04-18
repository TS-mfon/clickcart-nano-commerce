// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface Vm {
    function expectRevert(bytes4 revertData) external;
}

contract Test {
    Vm internal constant vm = Vm(address(uint160(uint256(keccak256("hevm cheat code")))));
}
