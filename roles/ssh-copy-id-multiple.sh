#!/bin/bash

# Define the hosts and corresponding passwords
declare -A hosts=(
  [web1]="dckr_pat_O-ZLHxbIi6kNbAFz1BTzaLtoni8"
  [web2]="dckr_pat_O-ZLHxbIi6kNbAFz1BTzaLtoni8"
  [db]="dckr_pat_O-ZLHxbIi6kNbAFz1BTzaLtoni8"
)

# Loop through each host and copy the SSH public key
for host in "${!hosts[@]}"; do
  password=${hosts[$host]}
  sshpass -p "$password" ssh-copy-id ansible@"$host"
done
