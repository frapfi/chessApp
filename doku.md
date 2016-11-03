# Relevant Wiki links

 - Algebraic notation (AN): https://en.wikipedia.org/wiki/Algebraic_notation_(chess)
 	- e.g.: For example, Be5 (move a bishop to e5), Nf3 (move a knight to f3
 - Portable Game Notation (PGN): https://de.wikipedia.org/wiki/Portable_Game_Notation
 	- e.g. Event "IBM Kasparov vs. Deep Blue Rematch":
		 1.e4 c6 2.d4 d5 3.Nc3 dxe4 4.Nxe4 Nd7 5.Ng5 Ngf6 6.Bd3 e6 7.N1f3 h6
		 8.Nxe6 Qe7 9.O-O fxe6 10.Bg6+ Kd8 {Kasparov schüttelt kurz den Kopf}
		 11.Bf4 b5 12.a4 Bb7 13.Re1 Nd5 14.Bg3 Kc8 15.axb5 cxb5 16.Qd3 Bc6
		 17.Bf5 exf5 18.Rxe7 Bxe7 19.c4 1-0
- Forsyth–Edwards Notation (FEN): https://en.wikipedia.org/wiki/Forsyth–Edwards_Notation
	- e.g.:
      FEN for the starting position: 
      rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
      Here is the FEN after the move 1. e4: 
      rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1
    - groups:
        - position: beginning left corner (a8); numbers represent empty fields
        - player which has to make a move
        - possible "rochades"
        - possible "en passants"
        - number of moves since last pawn move or piece capture(50 - moves - tie - rule)
        - number of next move
        
        
// -> '   +------------------------+
//      8 | r  n  b  q  k  b  n  r |
//      7 | p  p  p  p  .  p  p  p |
//      6 | .  .  .  .  .  .  .  . |
//      5 | .  .  .  .  p  .  .  . |
//      4 | .  .  .  .  P  P  .  . |
//      3 | .  .  .  .  .  .  .  . |
//      2 | P  P  P  P  .  .  P  P |
//      1 | R  N  B  Q  K  B  N  R |
//        +------------------------+
//          a  b  c  d  e  f  g  h'