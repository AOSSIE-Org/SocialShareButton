# Web3 & Smart Contract Standards

## Solidity Guidelines

- **OpenZeppelin:** All Solidity contracts MUST use standard OpenZeppelin implementations when applicable (e.g., ERC20, ERC721, AccessControl) to prevent security holes.
- **Inline Assembly:** Avoid introducing inline assembly unless explicitly directed by a maintainer.
- **Pragma:** Lock the compiler version (e.g., `pragma solidity 0.8.20;`), do not use floating pragmas (`^0.8.0`).

## Security

- Use the Checks-Effects-Interactions pattern to prevent reentrancy attacks.
- Do not use `tx.origin` for authorization.
- Handle potential integer overflow/underflow (Solidity 0.8+ does this natively, but remain vigilant).

## Testing

- Hardhat or Foundry MUST be used for comprehensive testing.
- Test coverage for smart contracts must be exhaustive, specifically covering edge cases and access controls.
