#!/bin/bash
export NODE_ENV=production
export DEBUG=main*

pm2 start start.sh --name NFT-Flush --time