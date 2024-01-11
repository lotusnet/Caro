import Link from "next/link";
import type { VFC } from "react";

export const Footer: VFC = () => {
	return (
		<>
			<div className="header-footer">
				<span>
					<Link href={`/`} legacyBehavior>
						<a>HOME</a>
					</Link>{" "}
					|{" "}
					<Link href={`/canvas`} legacyBehavior>
						<a>CANVAS</a>
					</Link>{" "}
					|{" "}
					<Link href={`/note`} legacyBehavior>
						<a>NOTE</a>
					</Link>{" "}
					|{" "}
					<Link href={`/schedule`} legacyBehavior>
						<a>SCHEDULE</a>
					</Link>{" "}
					|{" "}
					<Link href={`/checklist`} legacyBehavior>
						<a>CHECK LIST</a>
					</Link>
				</span>
				<footer>©2021. PETRO</footer>
			</div>
		</>
	);
};

export default Footer;
