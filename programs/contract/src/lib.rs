
use anchor_lang::prelude::*;

declare_id!("DRCz1kNKm9uMvTNhFS5eLHq9fjF1LmqPLLWncASFtY3M");

// Competition
// ----------------------------------------------------------------
// start_competition_ts: starting time to register
// end_inscription_ts: Ending time for registering in competition
// end_competition_ts: End day for the competition
// current_participants: Number of participants already subscribed
// max_participants: Max number of participants allowed 

#[program]
mod competition {
    use super::*;

    pub fn initialize_competition(
        ctx: Context<InitializeCompetition>, 

        start_competition_ts: i64,
        end_inscription_ts: i64,
        end_competition_ts: i64,
        max_participants: u16,
    ) -> ProgramResult {
        if !(
            start_competition_ts < end_competition_ts && 
            start_competition_ts < end_inscription_ts && 
            end_inscription_ts < end_competition_ts) {
            return Err(ErrorCode::SeqTimes.into());
        }          

        let competition_account = &mut ctx.accounts.competition_account;

        competition_account.start_competition_ts = start_competition_ts;
        competition_account.end_inscription_ts = end_inscription_ts;
        competition_account.end_competition_ts = end_competition_ts;

        competition_account.max_participants = max_participants;
        competition_account.current_participants = 0;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeCompetition<'info> {
    #[account(init, payer = user, space = 8 + 8 + 8 + 8 + 4)]
    pub competition_account: Account<'info, MyCompetition>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct MyCompetition {

    pub start_competition_ts: i64,
    pub end_inscription_ts: i64,
    pub end_competition_ts: i64,

    pub current_participants: u16,
    pub max_participants: u16,
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