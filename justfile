run-example:
    #!/bin/bash
    cd examples
    rm -rf ts-suigen
    cargo run -- -m suigen-configs/testnet.toml -o ts-suigen
