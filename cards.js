// moods: tired, angry, overthinking, lost, motivated, neutral
const MOOD_MAP = [
  {id:'tired', emoji:'😴', label:'Tired'},
  {id:'angry', emoji:'😡', label:'Angry'},
  {id:'overthinking', emoji:'🤯', label:'Overthinking'},
  {id:'lost', emoji:'😞', label:'Lost'},
  {id:'motivated', emoji:'💪', label:'Motivated'},
  {id:'neutral', emoji:'😐', label:'Neutral'}
];

const PATHS = {
  tired: [
    {truth:"Rest is a skill, not a luxury.","interpretation":"Your body signals overload; rest helps rewire effectiveness.","challenge":"Close eyes for one minute and breathe."},
    {truth:"Micro-rest stacks into energy.","interpretation":"Short breaks prevent crash later.","challenge":"Take a 2-minute refresh walk."},
    {truth:"Saying 'no' protects energy.","interpretation":"Overcommitment debts drain your focus.","challenge":"Say no to one nonessential task."},
    {truth:"Sleep routines cue recovery.","interpretation":"Small bedtime rituals change sleep quality.","challenge":"Turn off screens 30 minutes earlier."},
    {truth:"Energy is cyclical, not constant.","interpretation":"Work with your rhythm, not against it.","challenge":"Do one hard task at your peak hour."},
    {truth:"Self-kindness reduces burnout.","interpretation":"Beating yourself accelerates exhaustion.","challenge":"Say one kind sentence to yourself."},
    {truth:"Rest reveals what matters.","interpretation":"When you pause, priorities become clear.","challenge":"List one thing to drop this week."}
  ],
  angry: [
    {truth:"Anger is a signal, not a verdict.","interpretation":"It points to boundary or hurt.","challenge":"Name the feeling behind the anger."},
    {truth:"A pause prevents regret.","interpretation":"Sleep on it before reacting to heat.","challenge":"Count to 20 before you reply."},
    {truth:"Breath changes brain chemistry.","interpretation":"Simple breaths calm alarming loops.","challenge":"Do 6 slow breaths now."},
    {truth:"Labeling limits intensity.","interpretation":"Saying 'I'm angry' reduces takeover.","challenge":"Say the emotion out loud once."},
    {truth:"Move to change state.","interpretation":"Physical action reduces enraged energy.","challenge":"Walk for 3 minutes fast."},
    {truth:"Anger protects a value.","interpretation":"Find the value being threatened.","challenge":"Name the value behind this anger."},
    {truth:"Respond, don’t react.","interpretation":"A crafted reply keeps dignity intact.","challenge":"Write a calm sentence you could send."}
  ],
  overthinking: [
    {truth:"Thoughts are events, not facts.","interpretation":"You can observe them without following.","challenge":"Label one thought 'just a thought'."},
    {truth:"Decisions free you from loops.","interpretation":"Indecision feeds rumination.","challenge":"Pick one small choice and commit."},
    {truth:"Short timeboxes break analysis paralysis.","interpretation":"Limit thinking to 5 minutes then act.","challenge":"Set a 5-minute timer and decide."},
    {truth:"Rewrite the story, change the feeling.","interpretation":"Interpretations drive emotions more than facts.","challenge":"Reframe one worry into a question."},
    {truth:"Action disconfirms worst-case fantasies.","interpretation":"Do the smallest test to learn.","challenge":"Do one experiment for 10 minutes."},
    {truth:"Limit inputs to reduce noise.","interpretation":"More info often multiplies doubt.","challenge":"Close one tab or stop scrolling for 10m."},
    {truth:"Trust progress over perfection.","interpretation":"Small forward steps beat perfect inaction.","challenge":"Ship one imperfect thing today."}
  ],
  lost: [
    {truth:"Direction starts with clarity, not speed.","interpretation":"Slow down to find the right path.","challenge":"Write one sentence: 'I care about...'"},
    {truth:"Identity anchors decision-making.","interpretation":"Your values point the compass.","challenge":"Name one core value aloud."},
    {truth:"Small wins create momentum.","interpretation":"Tiny victories prove you can move forward.","challenge":"Finish a tiny task in 10 minutes."},
    {truth:"Boundaries free energy for what matters.","interpretation":"Say no to create yes space.","challenge":"Decline one distraction today."},
    {truth:"Ask: 'If I had to choose today, what would I do?'","interpretation":"Forced choice clarifies priorities.","challenge":"Choose one priority for today."},
    {truth:"Experimentation beats waiting for certainty.","interpretation":"Try one new thing and learn.","challenge":"Try something small you've avoided."},
    {truth:"Direction forms from repeated actions.","interpretation":"Consistency creates clarity over time.","challenge":"Repeat one small action for 3 days."}
  ],
  motivated: [
    {truth:"Focus is the multiplier of effort.","interpretation":"One focused hour beats scattered four.","challenge":"Work 45 minutes with no interruptions."},
    {truth:"Habits win when context is easy.","interpretation":"Design your environment for one action.","challenge":"Remove one friction for your main habit."},
    {truth:"Progress builds identity.","interpretation":"Link small wins to 'I am' statements.","challenge":"Name yourself after a win today."},
    {truth:"Momentum compounds quickly.","interpretation":"Finish a task to start the next easier.","challenge":"Finish one task fully, no partials."},
    {truth:"Rest preserves long-term productivity.","interpretation":"Don't burn out your engine now.","challenge":"Take a 10-minute restorative break."},
    {truth:"Accountability sharpens follow-through.","interpretation":"Tell one person what you'll do tomorrow.","challenge":"Message a friend your plan."},
    {truth:"Celebrate proof to fuel more action.","interpretation":"Record one small win and savor it.","challenge":"Write the win and keep it."}
  ],
  neutral: [
    {truth:"Neutral is fertile ground to build.","interpretation":"Use calm moments to set direction.","challenge":"Pick one small improvement to start."},
    {truth:"Curiosity unlocks motivation.","interpretation":"Ask a question to invite exploration.","challenge":"Ask yourself: 'What's interesting right now?'"},
    {truth:"Consistency outperforms intensity.","interpretation":"Regular small effort wins over bursts.","challenge":"Do 10 minutes of focused work."},
    {truth:"Clarity requires subtraction.","interpretation":"Remove one nonessential from your day.","challenge":"Drop one task for today."},
    {truth:"Reflection grows wisdom.","interpretation":"A short note keeps lessons alive.","challenge":"Write one insight from today."},
    {truth:"Boundaries protect what matters.","interpretation":"Set simple rules to guard time.","challenge":"No phone for 30 minutes this evening."},
    {truth:"Your story evolves with action.","interpretation":"You become who you practice to be.","challenge":"Do one action that matches who you want."}
  ]
};

