# Fffmpeg Service

A simple REST API which interacts with the `ffmpeg` CLI.

---
## Inspiration

I was working on a project to transcribe spoken audio files into text that I could then enter into my notebook.  To achieve this I needed to (1) extract audio files from video files and (2) convert those audio files to WAV.  This allows me to use the _Whisper API_ which accepts WAV files

---
## Developer Setup

TBD

---
## Release Process

The current release process couldn't be simpler.  To create a release, generate a Github tag and then push it to the repository.  This needs more refinement in the future but at the very least lets me get off the ground.

```sh
# Create new tag
git tag -a <tag_name> -m <tag description>

# Push tag to github
git push --follow-tags
```

The image produced by this action

---
## Service Deployment

This service is designed as part of a [Docker](https://docs.docker.com/reference/) deployment for simplicity.  Presently you can download the image from [Github Packages](https://github.com/tkottke90/ffmpeg-api/pkgs/container/ffmpeg-api).