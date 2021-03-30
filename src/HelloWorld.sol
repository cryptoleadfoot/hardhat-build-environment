contract HelloWorld {
    string private s;

    function getMessage() public view returns (string memory) {
        return s;
    }

    function setMessage(string memory _s) public {
        s = _s;
    }
}
