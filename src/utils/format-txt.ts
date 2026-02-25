export function firstCharUpperCase(text: string) {
	if (text.at(0) == undefined) {
		return "";
	}
	return text.at(0)!.toUpperCase() + text.slice(1);
}
