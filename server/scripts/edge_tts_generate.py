import argparse
import asyncio

import edge_tts


async def generate(text: str, voice: str, rate: str, output: str) -> None:
    communicate = edge_tts.Communicate(text=text, voice=voice, rate=rate)
    await communicate.save(output)


def main() -> None:
    parser = argparse.ArgumentParser(description="Edge TTS generator")
    parser.add_argument("--text", required=True)
    parser.add_argument("--voice", required=True)
    parser.add_argument("--rate", default="+0%")
    parser.add_argument("--output", required=True)
    args = parser.parse_args()

    asyncio.run(generate(args.text, args.voice, args.rate, args.output))


if __name__ == "__main__":
    main()
