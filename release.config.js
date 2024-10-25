module.exports={
  plugins: [
    ["@semantic-release/commit-analyzer", {
        releaseRules: [
            {"type": "major"  , "release": "major"},
            {"type": "release", "release": "major"},
        ],
        parserOpts: {
            "noteKeywords": ["BREAKING CHANGE", "BREAKING CHANGES", "BREAKING"]
        }
    }],

    ["@semantic-release/exec",{
        prepareCmd: `
            set -e
            VER=\${nextRelease.version}
            ##vso[build.updatebuildnumber]\${nextRelease.version}
            dotnet pack "src/$PROJECT_DIR/"*.csproj -o "$STAGING_PATH" -p:Configuration=Release -p:PackageVersion=$VER --verbosity Detailed
        `,
        successCmd: `
            set -e
            echo "##vso[task.setvariable variable=newVer;]yes"
        `,
      }],
      "@semantic-release/git",
      
      // Add the release-notes-generator to force version bump to 11.0.0
      ["@semantic-release/release-notes-generator", {
        presetConfig: {
          tag: "v11.0.0"
        }
      }]
    ],
  
  
  branches: [
    'master',
    {name: 'beta', channel: 'beta', prerelease: true},
    {name: 'preview', channel: 'beta', prerelease: true}
  ],
}
