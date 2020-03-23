:herb: Cinnamon Extension - Fullscreen to Workspace
===================================================

Fork of [satran/fullscreenworkspace-satran.in](https://github.com/satran/fullscreenworkspace-satran.in) Gnome extension, readapted to work on Cinnamon.

Original description by @satran:

> I got inspired by a feature by Elementary OS (which comes from macOS). It moves a fullscreen application to a separate workspace. This extension does just that. A lot of the code ideas come from https://github.com/rliang/gnome-shell-extension-maximize-to-workspace.

## Installation

```sh
cd ~/.local/share/cinnamon/extensions/
wget https://github.com/mttbernardini/fullscreen-to-workspace/archive/master.zip
unzip master.zip
mv fullscreen-to-workspace{-master,@mttbernardini}
rm master.zip
```

## Dev notes

- This work is mainly based on reverse-engineering other Cinnamon extensions and Cinnamon's source code itself, as I didn't find any reasonable documentation for extensions.
- In Cinnamon there's no `size-change` event on the `window_manager` object. For now I found `size-changed` event on window actors, but probably it's not the best solution.
- The actual implementation seems to be unefficient and has some crashes, needs more testing and polishing.