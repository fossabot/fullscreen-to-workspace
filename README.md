:herb: Cinnamon Extension - Fullscreen to Workspace
===================================================

Fork of [satran/fullscreenworkspace-satran.in](https://github.com/satran/fullscreenworkspace-satran.in) Gnome extension, readapted to work on Cinnamon.

Original description by @satran:

> I got inspired by a feature by Elementary OS (which comes from macOS). It moves a fullscreen application to a separate workspace. This extension does just that. A lot of the code ideas come from https://github.com/rliang/gnome-shell-extension-maximize-to-workspace.

## Installation
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fmttbernardini%2Ffullscreen-to-workspace.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fmttbernardini%2Ffullscreen-to-workspace?ref=badge_shield)


```sh
cd ~/.local/share/cinnamon/extensions/
wget https://github.com/mttbernardini/fullscreen-to-workspace/archive/master.zip
unzip master.zip
mv fullscreen-to-workspace{-master,@mttbernardini}
rm master.zip
```

## Dev notes

- In Cinnamon there's no `size-change` event on the `window_manager` object. For now I found `size-changed` event on window actors, but probably does not scale well.
- I fixed common scenario bugs, but there might still be some edge cases that I didn't check yet. More testing is needed.

## License
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fmttbernardini%2Ffullscreen-to-workspace.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fmttbernardini%2Ffullscreen-to-workspace?ref=badge_large)