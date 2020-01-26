<script>
import {onMount} from "svelte";
import sleep from "../utils/sleep";

export let count;

onMount(async function() {
	while (true) {
		count++;
		
		await sleep(1000);
	}
});
</script>

{count}
