
<div align="center" text-align="center">

# frag-finder

Takes JSON files exported from [CS:GO Demos Manager](https://github.com/akiver/CSGO-Demos-Manager) and spits out readable highlights meant as helpful filenames for CS:GO fragmovie recording.

<p>
  <img alt="Repository size" src="https://img.shields.io/github/repo-size/HenB13/frag-finder?color=#85C740">
  <img alt="Repository license" src="https://img.shields.io/github/license/HenB13/frag-finder?color=#85C740">
</p>
<p>
  <a href="#how-to-use">How to use</a> &#xa0; | &#xa0;
  <a href="#requirements">Requirements</a> &#xa0; | &#xa0;
  <a href="#options">Options</a> &#xa0; | &#xa0;
  <a href="#example">Example</a> &#xa0;
</p>

</div>

## Example output and explanation ###

```
**playdemo g2-vs-navi_map1-inferno@123000

   x._NiKo_4k-Famas_inferno_team-G2_r08 0:39 (demo_gototick 123000)
   x._s1mple_4k-AK-spread_inferno_team-navi_r10 1:42 (demo_gototick 171000)
   x._nexa_ACE-M4-fast_inferno_team-G2_r17_#ANTIECO 1:04 (demo_gototick 209000)
   x._s1mple_ACE-AWP(4)-deagle(1)_inferno_team-navi_r19 1:45 (demo_gototick 236000)
   x._s1mple_1v3-4k-MP9_inferno_team-navi_r21 1:20 (demo_gototick 273000)

         ----3k's:
               x._electronic_3k-AK_inferno_team-navi_r02_#ANTIECO 1:08 (demo_gototick 31000)
               x._Amanek_3k-M4_inferno_team-G2_r04 1:00 (demo_gototick 53000)
               
               
**playdemo astralis-vs-gambit_map2-nuke

   x._gla1ve_3k-pistol_nuke_team-astralis_r16 1:34 (demo_gototick 223000)
   x._Hobbit_AWP-4k_nuke_team-gambit_r33 1:11 (demo_gototick 439000)
```
  - <b>spread</b> (as in the frags being "spread out") is labelled for any 3k, 4k or ace where at least 15 seconds elapsed between two or more of the kills. 
  - <b>fast</b> is labelled for any frag where all the kills happen within six seconds.
  - The <b>timestamp</b> listed at the end of each frag represents the time shown on the ingame clock when the first kill of the highlight occures.
  - The <b>tick</b> listed at the end of each frag is the very end of the round prior (1000 ticks before the start of the target round to be precise). This is to prevent potential player model lags that can occur when using the "start of the round" button. Taking you to right before the round starts allows you to use the "next round" button instead, potentially preventing such lag. Including "demo_gototick" is meant for easier copy/paste to the ingame console.
    - The tick after the demo name (@123000) makes it so that you're taken to the start of the first highlight when using the playdemo command as listed.
  - The <b>round number</b> is shown at the end of each highlight string, for example <i>r25</i> for round 25.
  - the <b>x._</b> preceding every highlight is meant to be replaced by a number when you have recorded the frag, making the whole line appropriate as a filename for your video file. The information provided in the filename will then be easily searchable in your editing software, serving as helpful tags. For example: 
    
    <img src="./img/editing-software-example.png">

## How to use ##

1. Make sure you have [Node](https://nodejs.org/en/) and [CS:GO Demos Manager](https://github.com/akiver/CSGO-Demos-Manager) installed.
2. [Download](https://github.com/HenB13/frag-finder/archive/refs/heads/master.zip) or [clone](https://docs.github.com/en/get-started/getting-started-with-git/about-remote-repositories#cloning-with-https-urls) this repo.
3. Delete the [example.json](json/example.json) file in the [json](json) folder.
4. Open the demos in [CS:GO Demos Manager](https://github.com/akiver/CSGO-Demos-Manager) and analyze them. Select all, right click and select "Export JSON". Move the files to the [json](json) folder.
5. Open your terminal in the root folder of this repo and write `npm start`. The text file containing the highlights for all demos will be created in the [exports](exports) folder.  
 
<i>If you want to run the script again with different JSON files, move the already exported text file to a different location to prevent it from being overwritten.</i>

## Options ##

- If you want to get frags of a single player only, add their STEAMID64 as an argument to `getFrags` in the [app.js](app.js) file:

  ```javascript
  getFrags("76561198036024464");
  ```
  
## Requirements ##

* [Node](https://nodejs.org/en/)
* [CS:GO Demos Manager](https://github.com/akiver/CSGO-Demos-Manager)


## Example ##

  You can see an example of exported highlights in the [exports](exports/example.txt) folder.
