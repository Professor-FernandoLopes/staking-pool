pragma solidity ^0.6.6;

interface DepositContract {
    function deposit(
        bytes calldata pubkey,
        bytes calldata withdrawal_credentials,
        bytes calldata signature,
        bytes32 deposit_data_root
    ) external payable;
}

contract EthStakingPool {
    address DEPOSIT_CONTRACT = 0x00000000219ab540356cBB839Cbe05303d7705Fa;
    uint256 public DEPOSIT_AMOUNT = 32 ether;
    string public NAME = "ETH Staking Pool";

    mapping(address => uint256) public balances;
    mapping(address => bool) public hasClaimed;
    mapping(bytes => bool) public hasDeposited;

    bool public finalized = false; 
    address payable public owner;
    uint256 public weiLeftover;
    uint256 public weiRaised;
    uint256 public deadline;

    event EthReceived(address account, uint256 amount);
    event Finalize(address account, uint256 timestamp);
    event Claim(address account, uint256 amount);

    event Deposit(
        bytes pubkey,
        bytes withdrawal_credentials,
        bytes signature,
        bytes32 deposit_data_root,
        uint256 timestamp
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "must be owner");
        _;
    }

    modifier beforeDeadline() {
        require(block.timestamp <= deadline, "must be before deadline");
        _;
    }

    modifier afterDeadline() {
        require(block.timestamp > deadline, "must be after deadline");
        _;
    }

    modifier notFinalized() {
        require(finalized != true, "cannot be finalized");
        _;
    }

    modifier isFinalized() {
        require(finalized == true, "must be finalized");
        _;
    }

    constructor() public {
        owner = msg.sender;
        deadline = block.timestamp + 30 days;
        // deadline = 1611705600; // 01/27/2021 @ 12:00am (UTC)
    }

    receive() external payable beforeDeadline notFinalized {
        balances[msg.sender] += msg.value;
        emit EthReceived(msg.sender, msg.value);
    }

    function finalize() public afterDeadline notFinalized {
        finalized = true;
        weiRaised = address(this).balance;
        weiLeftover = weiRaised % DEPOSIT_AMOUNT;
        emit Finalize(msg.sender, now);
    }

    function claim() external isFinalized {
        require(balances[msg.sender] > 0, "balance must be greater than 0");
        require(hasClaimed[msg.sender] == false, "already claimed");
        hasClaimed[msg.sender] = true;
        uint256 amount = (weiLeftover * balances[msg.sender]) / weiRaised;
        msg.sender.transfer(amount);
        emit Claim(msg.sender, amount);
    }

    function deposit(
        bytes calldata pubkey,
        bytes calldata withdrawal_credentials,
        bytes calldata signature,
        bytes32 deposit_data_root
    ) external onlyOwner isFinalized {
        require(address(this).balance >= DEPOSIT_AMOUNT, "Error, deposit amount not reached");
        require(hasDeposited[pubkey] == false, "already deposited");

        DepositContract(DEPOSIT_CONTRACT).deposit{value: DEPOSIT_AMOUNT}(
            pubkey,
            withdrawal_credentials,
            signature,
            deposit_data_root
        );

        hasDeposited[pubkey] = true;

        emit Deposit(
            pubkey,
            withdrawal_credentials,
            signature,
            deposit_data_root,
            now
        );
    }
}