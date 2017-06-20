# Firebase Export

Firebase export helper utility for exporting excluded JSON from Firebase. 

# Installing

```
$ npm install -g firebase-export
```

or install it locally and add it to your path:

```
$ npm install firebase-export
$ export PATH=$PATH:`npm bin`
```

# Usage

```
$ firebase-export
Usage: firebase-export

Options:
      --database_url     Firebase database URL (e.g. https://databaseName.firebaseio.com).   [required]
      --firebase_secret  Firebase secret.                                                    [required]
      --exclude          Nodes to exclude. (e.g. settings/*, users/*/settings).
```

# Example 

```
$ firebase-export --database_url https://test.firebaseio-demo.com --firebase_secret '1234' --exclude 'settings/*, users/*/settings
```