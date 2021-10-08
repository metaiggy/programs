const assert = require("assert");
const anchor = require("@project-serum/anchor");
const { SystemProgram } = anchor.web3;

describe('competition', () => {
  // Use a local provider.
  const provider = anchor.Provider.local();

  // Configure the client to use the local cluster.
  anchor.setProvider(provider);
  
  let _competitionAccount;
  let startCompetitionTs = null;
  let endInscriptionTs = null;
  let endCompetitionTs = null;
  
  const maxParticipants = 10;

  it("fails to create an account if the dates are not sequential", async () => {
    // #region code-simplified
    // The program to execute.
    const program = anchor.workspace.Competition;

    // The Account to create.
    _competitionAccount = anchor.web3.Keypair.generate();

    const nowBn = new anchor.BN(Date.now() / 1000);
    startCompetitionTs = nowBn.add(new anchor.BN(25));
    endInscriptionTs = nowBn.add(new anchor.BN(10));
    endCompetitionTs = nowBn.add(new anchor.BN(15));


    try {
      await program.rpc.initializeCompetition(
        startCompetitionTs,
        endInscriptionTs,
        endCompetitionTs,
        maxParticipants, {
          accounts: {
            competitionAccount: _competitionAccount.publicKey,
            user: provider.wallet.publicKey,
            systemProgram: SystemProgram.programId,
          },
          signers: [_competitionAccount],
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
    const program = anchor.workspace.Competition;

    // The Account to create.
    _competitionAccount = anchor.web3.Keypair.generate();

    const nowBn = new anchor.BN(Date.now() / 1000);
    startCompetitionTs = nowBn.add(new anchor.BN(5));
    endInscriptionTs = nowBn.add(new anchor.BN(25));
    endCompetitionTs = nowBn.add(new anchor.BN(15));


    try {
      await program.rpc.initializeCompetition(
        startCompetitionTs,
        endInscriptionTs,
        endCompetitionTs,
        maxParticipants, {
          accounts: {
            competitionAccount: _competitionAccount.publicKey,
            user: provider.wallet.publicKey,
            systemProgram: SystemProgram.programId,
          },
          signers: [_competitionAccount],
        }
      );
      assert.ok(false);

    } catch (err)  {
      const errMsg = 'Competition times are non-sequential';
      assert.equal(err.toString(), errMsg);
    }
  });



  it("Creates and initializeCompetitions an account in a single atomic transaction (simplified)", async () => {
    // #region code-simplified
    // The program to execute.
    const program = anchor.workspace.Competition;

    // The Account to create.
    _competitionAccount = anchor.web3.Keypair.generate();

    const nowBn = new anchor.BN(Date.now() / 1000);
    startCompetitionTs = nowBn.add(new anchor.BN(5));
    endInscriptionTs = nowBn.add(new anchor.BN(10));
    endCompetitionTs = nowBn.add(new anchor.BN(15));

    // Create the new account and initializeCompetition it with the program.
    // #region code-simplified
    await program.rpc.initializeCompetition(
      startCompetitionTs,
      endInscriptionTs,
      endCompetitionTs,
      maxParticipants, {
        accounts: {
          competitionAccount: _competitionAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [_competitionAccount],
      }
    );
    // #endregion code-simplified

    console.log(program.account)

    // Fetch the newly created account from the cluster.
    const account = await program.account.myCompetition.fetch(_competitionAccount.publicKey);

    console.log(account);
    console.log(account.startCompetitionTs.toNumber() * 1000);
    console.log(Date.now())
    // Check it's state was initializeCompetitiond.

    assert.equal(account.maxParticipants, 10);

    // Store the account for the next test.
    // _competitionAccount = account;
  });

});
