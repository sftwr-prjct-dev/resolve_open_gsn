pragma solidity ^0.6.10;

// SPDX-License-Identifier: MIT OR Apache-2.0

import "@opengsn/gsn/contracts/BaseRelayRecipient.sol";

contract CaptureTheFlag is BaseRelayRecipient {
	string public override versionRecipient = "2.0.0";

	event FlagCaptured(address _from, address _to);

	address public flagHolder = address(0);

        // Get the forwarder address for the network
        // you are using from
        // https://docs.opengsn.org/deployments/networks.html
	constructor(address _forwarder) public {
		trustedForwarder = _forwarder;
	}

	function captureFlag() external {
		address previous = flagHolder;

                // The real sender. If you are using GSN, this
                // is not the same as msg.sender.
		flagHolder = _msgSender();  

		emit FlagCaptured(previous, flagHolder); 
	}
}