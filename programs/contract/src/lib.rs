
use anchor_lang::{prelude::*, solana_program::sysvar::clock};

declare_id!("DRCz1kNKm9uMvTNhFS5eLHq9fjF1LmqPLLWncASFtY3M");

// Competition
// ----------------------------------------------------------------
// start_registration: 
// 

#[program]
mod contract {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>, 
        data: u64, 
        start_competition_ts: i64,
        end_inscription_ts: i64,
        end_competition_ts: i64,
    ) -> ProgramResult {
        if !(
            start_competition_ts < end_competition_ts && 
            start_competition_ts < end_inscription_ts && 
            end_inscription_ts < end_competition_ts) {
            return Err(ErrorCode::SeqTimes.into());
        }          

        let my_account = &mut ctx.accounts.my_account;
        my_account.data = data;

        my_account.start_competition_ts = start_competition_ts;
        my_account.end_inscription_ts = end_inscription_ts;
        my_account.end_competition_ts = end_competition_ts;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + 8 + 8 + 8 + 8)]
    pub my_account: Account<'info, MyAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct MyAccount {
    pub data: u64,

    pub start_competition_ts: i64,
    pub end_inscription_ts: i64,
    pub end_competition_ts: i64,
}


#[error]
pub enum ErrorCode {
    #[msg("Competition must start in the future")]
    CompetitionFuture,
    #[msg("Competition times are non-sequential")]
    SeqTimes,
    #[msg("Competition has not started")]
    StartCompetitionTime,
    #[msg("Inscription period has ended")]
    EndInscriptionTime,
    #[msg("Competition has ended")]
    EndCompetitionTime,
    #[msg("Competition has not finished yet")]
    CompetitionNotOver,
    
    #[msg("Given nonce is invalid")]
    InvalidNonce,
}