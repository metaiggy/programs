const assert = require("assert");
const anchor = require("@project-serum/anchor");
const { SystemProgram } = anchor.web3;

describe('contract', () => {
  // Use a local provider.
  const provider = anchor.Provider.local();

  // Configure the client to use the local cluster.
  anchor.setProvider(provider);
  
  let _myAccount;
  let startCompetitionTs = null;
  let endInscriptionTs = null;
  let endCompetitionTs = null;

  it("fails to create an account if the dates are not sequential", async () => {
    // #region code-simplified
    // The program to execute.
    const program = anchor.workspace.Contract;

    // The Account to create.
    _myAccount = anchor.web3.Keypair.generate();

    const nowBn = new anchor.BN(Date.now() / 1000);
    startCompetitionTs = nowBn.add(new anchor.BN(25));
    endInscriptionTs = nowBn.add(new anchor.BN(10));
    endCompetitionTs = nowBn.add(new anchor.BN(15));


    try {
      await program.rpc.initialize(
        new anchor.BN(1234), 
        startCompetitionTs,
        endInscriptionTs,
        endCompetitionTs, {
          accounts: {
            myAccount: _myAccount.publicKey,
            user: provider.wallet.publicKey,
            systemProgram: SystemProgram.programId,
          },
          signers: [_myAccount],
        }
      );
      assert.ok(false);

    } catch (err)  {
      const errMsg = 'Competition times are non-sequential';
      assert.equal(err.toString(), errMsg);
    }
  });

  it("fails to create an account if the dates are not sequential", async () => {
    // #region code-simplified
    // The program to execute.
    const program = anchor.workspace.Contract;

    // The Account to create.
    _myAccount = anchor.web3.Keypair.generate();

    const nowBn = new anchor.BN(Date.now() / 1000);
    startCompetitionTs = nowBn.add(new anchor.BN(5));
    endInscriptionTs = nowBn.add(new anchor.BN(25));
    endCompetitionTs = nowBn.add(new anchor.BN(15));


    try {
      await program.rpc.initialize(
        new anchor.BN(1234), 
        startCompetitionTs,
        endInscriptionTs,
        endCompetitionTs, {
          accounts: {
            myAccount: _myAccount.publicKey,
            user: provider.wallet.publicKey,
            systemProgram: SystemProgram.programId,
          },
          signers: [_myAccount],
        }
      );
      assert.ok(false);

    } catch (err)  {
      const errMsg = 'Competition times are non-sequential';
      assert.equal(err.toString(), errMsg);
    }
  });



  it("Creates and initializes an account in a single atomic transaction (simplified)", async () => {
    // #region code-simplified
    // The program to execute.
    const program = anchor.workspace.Contract;

    // The Account to create.
    _myAccount = anchor.web3.Keypair.generate();

    const nowBn = new anchor.BN(Date.now() / 1000);
    startCompetitionTs = nowBn.add(new anchor.BN(5));
    endInscriptionTs = nowBn.add(new anchor.BN(10));
    endCompetitionTs = nowBn.add(new anchor.BN(15));

    // Create the new account and initialize it with the program.
    // #region code-simplified
    await program.rpc.initialize(
      new anchor.BN(1234), 
      startCompetitionTs,
      endInscriptionTs,
      endCompetitionTs, {
        accounts: {
          myAccount: _myAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [_myAccount],
      }
    );
    // #endregion code-simplified

    // Fetch the newly created account from the cluster.
    const account = await program.account.myAccount.fetch(_myAccount.publicKey);

    console.log(account);
    console.log(account.startCompetitionTs.toNumber() * 1000);
    console.log(Date.now())
    // Check it's state was initialized.
    assert.ok(account.data.eq(new anchor.BN(1234)));

    assert.ok(account.data.eq(new anchor.BN(1234)));

    // Store the account for the next test.
    _myAccount = _myAccount;
  });
/* 
  it("Updates a previously created account", async () => {
    const myAccount = _myAccount;

    // #region update-test

    // The program to execute.
    const program = anchor.workspace.Contract;

    // Invoke the update rpc.
    await program.rpc.update(new anchor.BN(4321), {
      accounts: {
        myAccount: myAccount.publicKey,
      },
    });

    // Fetch the newly updated account.
    const account = await program.account.myAccount.fetch(myAccount.publicKey);

    // Check it's state was mutated.
    assert.ok(account.data.eq(new anchor.BN(4321)));

    // #endregion update-test
  }); */
});
