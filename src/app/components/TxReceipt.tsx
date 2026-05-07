"use client";
import { useState } from "react";
import type { Chain } from "thirdweb/chains";

type TxReceiptProps = {
	hash: string;
	chain: Chain;
	onClose?: () => void;
};

const getExplorer = (chain: Chain) => {
	const explorer = chain.blockExplorers?.[0];
	if (explorer) return explorer;
	return { name: "Block Explorer", url: "" };
};

const truncate = (hash: string) =>
	hash.length > 18 ? `${hash.slice(0, 10)}…${hash.slice(-8)}` : hash;

export const TxReceipt: React.FC<TxReceiptProps> = ({
	hash,
	chain,
	onClose,
}) => {
	const [copied, setCopied] = useState(false);
	const explorer = getExplorer(chain);
	const txUrl = explorer.url ? `${explorer.url}/tx/${hash}` : "";

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(hash);
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		} catch {
			// clipboard unavailable
		}
	};

	return (
		<div className="mt-6 w-full max-w-xl rounded-2xl border border-zinc-700/60 bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 shadow-xl">
			<div className="flex items-start gap-4">
				<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2.5"
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
					>
						<path d="M20 6 9 17l-5-5" />
					</svg>
				</div>
				<div className="flex-1">
					<div className="flex items-center justify-between">
						<h3 className="text-lg font-semibold text-zinc-100">
							Transaction confirmed
						</h3>
						{onClose && (
							<button
								type="button"
								onClick={onClose}
								className="rounded-md p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
								aria-label="Dismiss"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									aria-hidden="true"
								>
									<path d="M18 6 6 18M6 6l12 12" />
								</svg>
							</button>
						)}
					</div>
					<p className="mt-2 text-sm leading-relaxed text-zinc-400">
						Your transaction is now permanently recorded on{" "}
						<span className="font-medium text-zinc-200">{chain.name}</span>. A{" "}
						<span className="font-medium text-zinc-200">block explorer</span>{" "}
						is a public website that lets anyone inspect on-chain activity —
						addresses, blocks, and every transaction including this one. Open
						the link below to see status, gas, logs and emitted events for the
						operation you just performed.
					</p>

					<div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
						<div className="text-[11px] uppercase tracking-wider text-zinc-500">
							Transaction hash
						</div>
						<div className="mt-1 flex items-center justify-between gap-3">
							<code className="font-mono text-sm text-zinc-200">
								{truncate(hash)}
							</code>
							<button
								type="button"
								onClick={handleCopy}
								className="shrink-0 rounded-md border border-zinc-700 bg-zinc-800/60 px-2 py-1 text-xs text-zinc-300 transition hover:border-zinc-600 hover:bg-zinc-800"
							>
								{copied ? "Copied" : "Copy"}
							</button>
						</div>
					</div>

					<div className="mt-4 flex flex-wrap items-center gap-3">
						{txUrl ? (
							<a
								href={txUrl}
								target="_blank"
								rel="noreferrer noopener"
								className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-zinc-200"
							>
								View on {explorer.name}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									aria-hidden="true"
								>
									<path d="M7 7h10v10" />
									<path d="M7 17 17 7" />
								</svg>
							</a>
						) : (
							<span className="text-xs text-zinc-500">
								No block explorer configured for this chain.
							</span>
						)}
						<span className="text-xs text-zinc-500">
							Opens in a new tab · Public data
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TxReceipt;
