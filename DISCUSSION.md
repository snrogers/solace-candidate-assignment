# A Discussion!

I punched up the UI with ShadCN.

If this had been a real for-money project that's going to be maintained (and get bigger) for a while, I'd personally:
- Effect-ify the whole server side, making heavy use of the Service/Layer concept to implement a Ports/Adapters pattern for... I dunno, there's a pretentious word for this kind of 
  testing where you simulate all effectful calls, esp. calls over the network. I can't recall it off the top of my head because I discovered it myself long before I heard a name for it,
  since it's basically just "the only way to actually test a distributed system"
- Use something like TanStack for fetching/caching instead of rolling my own solution. And do something clever with end-to-end type safety (generated code maybe?). I've really been digging GQL lately and it _basically_ has end-to-end auto-generated type safety out of the box.
- Just write a hook that acts like `useState` but stores its value in the searchParams. I did it before at my last job, but I expected Next.js (never used it before) to have a built-in way to do this.
- Set searchParams to sensible defaults when invalid. And, this should just be part of a `useSearchParams` hook( thing I wrote at last job did this, again I should have just rewritten here). I've never been super front-end focused, but there has GOT to be an industry standard tool for this.


PS. After thinking about it, I don't know whether the issue with jsonb encoding was intentional or not, so if I just solved a real problem y'all have in production, y'all had better make me an offer lmao.
